import cls from './style.module.scss';
import {
  SectionAbout,
  SectionContact,
  SectionHero,
  SectionPortfolio,
  SectionProcess,
  SectionServices,
  SectionsFAQ,
  SectionsStack,

} from '@/components/templates';


const Home = (props: any) => {

  return <main className={cls.wrap}>
    <SectionHero />
    <SectionAbout />
    <SectionProcess />
    <SectionServices />
    <SectionPortfolio />
    <SectionsStack />
    <SectionContact />
    <SectionsFAQ />
  </main>
}

export default Home;