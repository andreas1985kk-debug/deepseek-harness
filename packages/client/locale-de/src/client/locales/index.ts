/**
 * The German dictionaries, one entry per shipped client namespace. Keys mirror
 * each namespace's English source; a key missed here falls back to English.
 */
import { de as common } from './common.ts'
import { de as settings_locale } from './settings.locale.ts'
import { de as settings_theme } from './settings.theme.ts'
import { de as sidebar } from './sidebar.ts'
import { de as sidebarRight } from './sidebarRight.ts'
import { de as sidebarDocumentPreview } from './sidebarDocumentPreview.ts'
import { de as documentMarkdown } from './documentMarkdown.ts'
import { de as documentHtml } from './documentHtml.ts'
import { de as sidebarPdf } from './sidebarPdf.ts'
import { de as sidebarImage } from './sidebarImage.ts'
import { de as sidebarCodePreview } from './sidebarCodePreview.ts'
import { de as sidebarFiles } from './sidebarFiles.ts'
import { de as sidebarTerminal } from './sidebarTerminal.ts'
import { de as settings } from './settings.ts'
import { de as settings_models } from './settings.models.ts'
import { de as settings_pluginInventory } from './settings.pluginInventory.ts'
import { de as settings_archivedSessions } from './settings.archivedSessions.ts'
import { de as settings_plugins } from './settings.plugins.ts'
import { de as conversation } from './conversation.ts'
import { de as approval } from './approval.ts'
import { de as chat } from './chat.ts'
import { de as cordis } from './cordis.ts'
import { de as workflowRun } from './workflowRun.ts'
import { de as deliverables } from './deliverables.ts'
import { de as workspace } from './workspace.ts'
import { de as slash_menu } from './slash.menu.ts'
import { de as command } from './command.ts'
import { de as skill } from './skill.ts'
import { de as subagent } from './subagent.ts'
import { de as reference } from './reference.ts'
import { de as job } from './job.ts'
import { de as goal } from './goal.ts'
import { de as feedback } from './feedback.ts'
import { de as model } from './model.ts'
import { de as permission_access } from './permission.access.ts'
import { de as settings_permission } from './settings.permission.ts'
import { de as settings_agentPreset } from './settings.agentPreset.ts'
import { de as plan } from './plan.ts'
import { de as question } from './question.ts'
import { de as trajectory } from './trajectory.ts'
import { de as schedule_catalog } from './schedule.catalog.ts'
import { de as session_log_download } from './session-log-download.ts'
import { de as directory_browser } from './directory-browser.ts'
import { de as open_in_app } from './open-in-app.ts'

/** The BCP 47-style id of the locale this package contributes. */
export const LOCALE_ID = 'de'

/** Self-described label rendered in the Settings → General language row. */
export const LOCALE_LABEL = 'Deutsch'

/** Namespace id to its German dictionary. */
export const DE: Record<string, Record<string, string>> = {
  'common': common,
  'settings.locale': settings_locale,
  'settings.theme': settings_theme,
  'sidebar': sidebar,
  'sidebarRight': sidebarRight,
  'sidebarDocumentPreview': sidebarDocumentPreview,
  'documentMarkdown': documentMarkdown,
  'documentHtml': documentHtml,
  'sidebarPdf': sidebarPdf,
  'sidebarImage': sidebarImage,
  'sidebarCodePreview': sidebarCodePreview,
  'sidebarFiles': sidebarFiles,
  'sidebarTerminal': sidebarTerminal,
  'settings': settings,
  'settings.models': settings_models,
  'settings.pluginInventory': settings_pluginInventory,
  'settings.archivedSessions': settings_archivedSessions,
  'settings.plugins': settings_plugins,
  'conversation': conversation,
  'approval': approval,
  'chat': chat,
  'cordis': cordis,
  'workflowRun': workflowRun,
  'deliverables': deliverables,
  'workspace': workspace,
  'slash.menu': slash_menu,
  'command': command,
  'skill': skill,
  'subagent': subagent,
  'reference': reference,
  'job': job,
  'goal': goal,
  'feedback': feedback,
  'model': model,
  'permission.access': permission_access,
  'settings.permission': settings_permission,
  'settings.agentPreset': settings_agentPreset,
  'plan': plan,
  'question': question,
  'trajectory': trajectory,
  'schedule.catalog': schedule_catalog,
  'session-log-download': session_log_download,
  'open-in-app': open_in_app,
  'directory-browser': directory_browser,
}
