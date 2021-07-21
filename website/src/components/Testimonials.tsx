import Translate from '@docusaurus/Translate';
import React from 'react';
import styles from './Testimonials.module.scss';
import TwitterCarrousel from './TwitterCarrousel';

const Testimonials = (): React.ReactElement => (
  <section className={styles.testimonials}>
    <h3>
      <Translate
        values={{
          italicVerdaccio: <i>Verdaccio</i>,
        }}
      >
        {"Here's what people have to say about {italicVerdaccio}"}
      </Translate>
    </h3>
    <div>
      <TwitterCarrousel
        data={[
          ['1002609907370250241', '951427300070916096', '1291333754372399105'],
          ['1413249199022485511', '1169571193550192641', '1403589174905610240'],
        ]}
      />
    </div>
    <p>
      <Translate>Many greats developers and companies are enjoying Verdaccio, join the community!</Translate>
    </p>
  </section>
);

export default Testimonials;
