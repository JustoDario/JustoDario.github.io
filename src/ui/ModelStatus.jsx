import { useSyncExternalStore } from 'react'
import { MODELS } from '../data/models.js'
import { useLanguage } from '../i18n/LanguageProvider.jsx'
import { useNavigation } from '../state/NavigationProvider.jsx'
import { getModelStatus, retryModel, subscribeModelStatus } from '../state/modelStatus.js'
import { getSceneHealth, subscribeSceneHealth } from '../state/sceneHealth.js'

// Tells the visitor when the robot of the current station cannot be shown.
export default function ModelStatus() {
  const { t } = useLanguage()
  const { station } = useNavigation()
  const { errors, loaded } = useSyncExternalStore(subscribeModelStatus, getModelStatus)
  const file = MODELS[station.model]?.file
  const kind = file && errors[file]
  const { sceneUnavailable } = useSyncExternalStore(subscribeSceneHealth, getSceneHealth)

  if (sceneUnavailable === 'none') return null
  if (sceneUnavailable) {
    return station.model ? (
      <div className="model-status" role="status" data-testid="scene-status">
        <p>{t(`scene.${sceneUnavailable}`)}</p>
      </div>
    ) : null
  }
  // Waiting for the robot: never an empty space with no explanation.
  if (!kind) return file && !loaded[file] ? <div className="robot-loader" data-testid="robot-loader" aria-hidden="true" /> : null

  return (
    <div className="model-status" role="status" data-testid="model-status">
      <p>{t('model.failed')}</p>
      {kind === 'retry' ? (
        <button type="button" className="button" onClick={() => retryModel(file)}>
          {t('model.retry')}
        </button>
      ) : (
        <button type="button" className="button" onClick={() => window.location.reload()}>
          {t('model.reload')}
        </button>
      )}
    </div>
  )
}
