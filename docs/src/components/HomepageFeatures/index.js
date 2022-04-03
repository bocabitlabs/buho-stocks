import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Manage your portfolio(s)',
    Svg: require('@site/static/img/undraw_finance_re_gnv2.svg').default,
    description: (
      <>
        Buho Stocks was created to make managing your portfolio(s) easier.
      </>
    ),
  },
  {
    title: 'Track their performance',
    Svg: require('@site/static/img/undraw_chart_86kg.svg').default,
    description: (
      <>
        Track the performance of your portfolio with stats and charts.
      </>
    ),
  },
  {
    title: 'Register your icome',
    Svg: require('@site/static/img/undraw_personal_finance_re_ie6k.svg').default,
    description: (
      <>
        Register your transactions and dividends and get a report of your income.
      </>
    ),
  },
  {
    title: 'Multiple markets and sectors',
    Svg: require('@site/static/img/undraw_connected_world_wuay.svg').default,
    description: (
      <>
        You can register your portfolio and companies in multiple markets and sectors.
      </>
    ),
  },
  {
    title: 'Multiple currencies',
    Svg: require('@site/static/img/undraw_savings_re_eq4w.svg').default,
    description: (
      <>
        Support for a wide range of currencies.
      </>
    ),
  },
  {
    title: 'Real exchange rates and stock prices',
    Svg: require('@site/static/img/undraw_stock_prices_re_js33.svg').default,
    description: (
      <>
        Obtain real exchange rates and stock prices for your transactions and companies.
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
