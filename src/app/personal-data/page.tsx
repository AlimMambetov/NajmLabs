import { Markdown } from "@/components/ui";
import data from '&/docs/personal-data.md'

export default (props: any) => {

  return (<>
    <Markdown data={data} />
  </>)
};