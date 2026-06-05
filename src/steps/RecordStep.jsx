import { StepHeader, ConfigSection, StepBody } from '../shared/StepLayout'
import PropertyBuilder from '../shared/PropertyBuilder'
import SectionBuilder from '../shared/SectionBuilder'
import ActivityToggles from '../shared/ActivityToggles'
import PipelineConfigurator from '../shared/PipelineConfigurator'

// Generic record configurator shared by Contacts/Companies/Deals/Tickets (Steps 2-5).
// `pipeline` adds the stage configurator; `pipelineProbability` controls the % column.
export default function RecordStep({
  index,
  slice,
  intro,
  pipeline = false,
  pipelineProbability = true,
  pipelineTitle = 'Pipeline Stages',
}) {
  return (
    <StepBody>
      <StepHeader index={index} intro={intro} />

      <ConfigSection title="Key Properties" hint="Locked fields are always included">
        <PropertyBuilder slice={slice} />
      </ConfigSection>

      {pipeline && (
        <ConfigSection title={pipelineTitle} hint="Rename, reorder, add stages">
          <PipelineConfigurator slice={slice} showProbability={pipelineProbability} />
        </ConfigSection>
      )}

      <ConfigSection title="Record Page Sections" hint="Toggle + reorder">
        <SectionBuilder slice={slice} />
      </ConfigSection>

      <ConfigSection title="Activity Timeline Items">
        <ActivityToggles slice={slice} />
      </ConfigSection>
    </StepBody>
  )
}
