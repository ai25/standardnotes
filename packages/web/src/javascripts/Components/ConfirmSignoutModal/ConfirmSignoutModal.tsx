import { FunctionComponent, useCallback, useEffect, useRef, useState } from 'react'
import { AlertDialog, AlertDialogDescription, AlertDialogLabel } from '@reach/alert-dialog'
import { STRING_SIGN_OUT_CONFIRMATION } from '@/Constants/Strings'
import { WebApplication } from '@/Application/Application'
import { ViewControllerManager } from '@/Controllers/ViewControllerManager'
import { observer } from 'mobx-react-lite'
import { ApplicationGroup } from '@/Application/ApplicationGroup'
import { isDesktopApplication } from '@/Utils'
import Button from '@/Components/Button/Button'
import Icon from '../Icon/Icon'

type Props = {
  application: WebApplication
  viewControllerManager: ViewControllerManager
  applicationGroup: ApplicationGroup
}

const ConfirmSignoutModal: FunctionComponent<Props> = ({ application, viewControllerManager, applicationGroup }) => {
  const [deleteLocalBackups, setDeleteLocalBackups] = useState(false)

  const cancelRef = useRef<HTMLButtonElement>(null)
  const closeDialog = useCallback(() => {
    viewControllerManager.accountMenuController.setSigningOut(false)
  }, [viewControllerManager.accountMenuController])

  const [localBackupsCount, setLocalBackupsCount] = useState(0)

  useEffect(() => {
    application.desktopDevice?.localBackupsCount().then(setLocalBackupsCount).catch(console.error)
  }, [viewControllerManager.accountMenuController.signingOut, application.desktopDevice])

  const workspaces = applicationGroup.getDescriptors()
  const showWorkspaceWarning = workspaces.length > 1 && isDesktopApplication()

  const confirm = useCallback(() => {
    if (deleteLocalBackups) {
      application.signOutAndDeleteLocalBackups().catch(console.error)
    } else {
      application.user.signOut().catch(console.error)
    }
    closeDialog()
  }, [application, closeDialog, deleteLocalBackups])

  return (
    <AlertDialog onDismiss={closeDialog} leastDestructiveRef={cancelRef} className="max-w-[600px] p-0">
      <div className="sk-modal-content">
        <div className="sn-component">
          <div className="sk-panel">
            <div className="sk-panel-content">
              <div className="sk-panel-section">
                <AlertDialogLabel className="flex items-center justify-between text-lg font-bold">
                  Sign out workspace?
                  <button className="rounded p-1 font-bold hover:bg-contrast" onClick={closeDialog}>
                    <Icon type="close" />
                  </button>
                </AlertDialogLabel>
                <AlertDialogDescription className="sk-panel-row">
                  <div>
                    <p className="text-base text-foreground lg:text-sm">{STRING_SIGN_OUT_CONFIRMATION}</p>
                    {showWorkspaceWarning && (
                      <>
                        <br />
                        <p className="text-base text-foreground lg:text-sm">
                          <strong>Note: </strong>
                          Because you have other workspaces signed in, this sign out may leave logs and other metadata
                          of your session on this device. For a more robust sign out that performs a hard clear of all
                          app-related data, use the <i>Sign out all workspaces</i> option under <i>Switch workspace</i>.
                        </p>
                      </>
                    )}
                  </div>
                </AlertDialogDescription>

                {localBackupsCount > 0 && (
                  <div className="flex">
                    <div className="sk-panel-row"></div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={deleteLocalBackups}
                        onChange={(event) => {
                          setDeleteLocalBackups((event.target as HTMLInputElement).checked)
                        }}
                      />
                      <span className="ml-2">
                        Delete {localBackupsCount} local backup file
                        {localBackupsCount > 1 ? 's' : ''}
                      </span>
                    </label>
                    <button
                      className="sk-a ml-1.5 cursor-pointer rounded p-0 capitalize"
                      onClick={() => {
                        application.desktopDevice?.viewlocalBackups()
                      }}
                    >
                      View backup files
                    </button>
                  </div>
                )}

                <div className="my-1 mt-4 flex justify-end gap-2">
                  <Button ref={cancelRef} onClick={closeDialog}>
                    Cancel
                  </Button>
                  <Button primary colorStyle="danger" onClick={confirm}>
                    {application.hasAccount() ? 'Sign Out' : 'Delete Workspace'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AlertDialog>
  )
}

ConfirmSignoutModal.displayName = 'ConfirmSignoutModal'

const ConfirmSignoutContainer = (props: Props) => {
  if (!props.viewControllerManager.accountMenuController.signingOut) {
    return null
  }
  return <ConfirmSignoutModal {...props} />
}

export default observer(ConfirmSignoutContainer)
