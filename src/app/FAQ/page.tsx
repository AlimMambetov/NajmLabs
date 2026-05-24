import cls from './style.module.scss';
import {
  SectionsFAQ,
} from '@/components/templates';


const FAQ = (props: any) => {

  return <main className={cls.wrap}>
    <SectionsFAQ />
  </main>
}

export default FAQ;