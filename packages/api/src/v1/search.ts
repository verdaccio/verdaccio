import semver from 'semver'
import { Package } from '@verdaccio/types';

function compileTextSearch(textSearch: string): ((pkg: Package) => boolean) {
        const personMatch = (person, search) => {
            if(typeof person === 'string')
                {return person.includes(search);}

            if(typeof person === 'object')
                {for(const field of Object.values(person))
                    {if(typeof field === 'string' && field.includes(search))
                        {return true;}}}

            return false;
        }
        const matcher = function(q) {
            const match = q.match(/author:(.*)/)
            if(match !== null)
                {return (pkg) => personMatch(pkg.author, match[1])}

            // TODO: maintainer, keywords, not/is unstable insecure, boost-exact
            // TODO implement some scoring system for freetext
            return (pkg) => {
                return ['name', 'displayName', 'description']
                    .map(k => pkg[k])
                    .filter(x => x !== undefined)
                    .some(txt => txt.includes(q))
            };
        }

        const textMatchers = (textSearch || '').split(' ').map(matcher);
        return (pkg) => textMatchers.every(m => m(pkg));
}

export default function(route, auth, storage): void {
    route.get('/-/v1/search', (req, res)=>{
        // TODO: implement proper result scoring weighted by quality, popularity and maintenance query parameters
        let [text, size, from /* , quality, popularity, maintenance */] =
            ['text', 'size', 'from' /* , 'quality', 'popularity', 'maintenance' */]
            .map(k => req.query[k])

        size = parseInt(size) || 20;
        from = parseInt(from) || 0;

        const isInteresting = compileTextSearch(text);

        const resultStream = storage.search(0, {req: {query: {local: true}}});
        const resultBuf = [] as any;
        let completed = false;

        const sendResponse = (): void => {
            completed = true;
            resultStream.destroy()

            const final = resultBuf.slice(from, size).map(pkg => {
                        return {
                            package: pkg,
                            flags: {
                                unstable:
                                    Object.keys(pkg.versions)
                                        .some(v => semver.satisfies(v, '^1.0.0'))
                                         ? undefined
                                         : true
                            },
                            score: {
                                final: 1,
                                detail: {
                                    quality: 1,
                                    popularity: 1,
                                    maintenance: 0
                                }
                            },
                            searchScore: 100000
                        }
                    })
            const response = {
                    objects: final,
                    total: final.length,
                    time: new Date().toUTCString()
                }

            res.status(200)
                .json(response)
        }

        resultStream.on('data', (pkg)=>{
            if(!isInteresting(pkg))
                {return;}
            resultBuf.push(pkg)
            if(!completed && resultBuf.length >= size + from)
                {sendResponse();}
        })
        resultStream.on('end', ()=>{
            if(!completed)
                {sendResponse()}
        })
    })
}
