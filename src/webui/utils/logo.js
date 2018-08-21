import API from './api';

export default async function logo() {
    try {
        const logo = await API.request('logo');
        return logo;
    } catch (error) {
        throw new Error(error);
    }
}
