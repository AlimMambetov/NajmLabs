import { Markdown } from "@/components/ui";
import data from '&/docs/privacy-policy.md'

export default (props: any) => {

  return (<>
    <Markdown data={data} />
  </>)
};