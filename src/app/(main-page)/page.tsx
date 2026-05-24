import cls from './style.module.scss';
import {
  SectionAbout,
  SectionContact,
  SectionHero,
  SectionPortfolio,
  SectionProcess,
  SectionServices,
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
  </main>
}

export default Home;