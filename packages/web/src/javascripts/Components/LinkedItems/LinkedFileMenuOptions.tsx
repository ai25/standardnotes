import { FOCUSABLE_BUT_NOT_TABBABLE } from '@/Constants/Constants'
import { FilesController } from '@/Controllers/FilesController'
import { FileItem } from '@standardnotes/snjs'
import { useState } from 'react'
import { FileItemActionType } from '../AttachedFilesPopover/PopoverFileItemAction'
import { FileContextMenuBackupOption } from '../FileContextMenu/FileContextMenuBackupOption'
import Icon from '../Icon/Icon'
import MenuItem from '../Menu/MenuItem'
import HorizontalSeparator from '../Shared/HorizontalSeparator'
import Switch from '../Switch/Switch'

type Props = {
  file: FileItem
  closeMenu: () => void
  handleFileAction: FilesController['handleFileAction']
  setIsRenamingFile: (set: boolean) => void
}

const LinkedFileMenuOptions = ({ file, closeMenu, handleFileAction, setIsRenamingFile }: Props) => {
  const [isFileProtected, setIsFileProtected] = useState(file.protected)

  return (
    <>
      <MenuItem
        onClick={() => {
          void handleFileAction({
            type: FileItemActionType.PreviewFile,
            payload: {
              file,
              otherFiles: [],
            },
          })
          closeMenu()
        }}
      >
        <Icon type="file" className="mr-2 text-neutral" />
        Preview file
      </MenuItem>
      <HorizontalSeparator classes="my-1" />
      <MenuItem
        className="justify-between"
        onClick={() => {
          handleFileAction({
            type: FileItemActionType.ToggleFileProtection,
            payload: { file },
            callback: (isProtected: boolean) => {
              setIsFileProtected(isProtected)
            },
          }).catch(console.error)
        }}
      >
        <span className="flex items-center">
          <Icon type="lock" className="mr-2 text-neutral" />
          Password protect
        </span>
        <Switch className="pointer-events-none px-0" tabIndex={FOCUSABLE_BUT_NOT_TABBABLE} checked={isFileProtected} />
      </MenuItem>
      <HorizontalSeparator classes="my-1" />
      <MenuItem
        onClick={() => {
          handleFileAction({
            type: FileItemActionType.DownloadFile,
            payload: { file },
          }).catch(console.error)
          closeMenu()
        }}
      >
        <Icon type="download" className="mr-2 text-neutral" />
        Download
      </MenuItem>
      <MenuItem
        onClick={() => {
          setIsRenamingFile(true)
          closeMenu()
        }}
      >
        <Icon type="pencil" className="mr-2 text-neutral" />
        Rename
      </MenuItem>
      <MenuItem
        onClick={() => {
          handleFileAction({
            type: FileItemActionType.DeleteFile,
            payload: { file },
          }).catch(console.error)
          closeMenu()
        }}
      >
        <Icon type="trash" className="mr-2 text-danger" />
        <span className="text-danger">Delete permanently</span>
      </MenuItem>

      <FileContextMenuBackupOption file={file} />
    </>
  )
}

export default LinkedFileMenuOptions
