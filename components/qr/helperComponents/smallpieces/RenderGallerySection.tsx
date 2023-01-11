import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import { conjunctMethods, toBytes } from '../../../../utils';
import { ALLOWED_FILE_EXTENSIONS, FILE_LIMITS } from '../../../../consts';
import { DataType, MediaField } from '../../types/types';
import FileUpload from 'react-material-file-upload';

interface RenderGallerySectionProps {
  item: MediaField;
  index: number;
  setData: Function;
  accept:string[];
}

/**
 * @brief renders the gallery field 
 * @param {RenderGallerySectionProps} component it will try to save de data on data['fields'][index]
 * @returns A component that renders the gallery field
 */
export default function RenderGallerySection({
  index,
  item,
  setData,
}: RenderGallerySectionProps) {
  const [galleries, setGalleries] = useState<number>(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const MAX_NUM_GALLERIES = 6;

  const updateFields = (files: File[], index: number) => {
    
    setData((prev: DataType) => {
      const tempo = { ...prev };
      if (!tempo.fields) {
        tempo.fields = [];
      }
      // * only let pass fields with files on it
      if(tempo.fields[index] === undefined || tempo.fields[index].type !== 'media' )
        return prev;

      const isSameFile = (uploadedFile: File, fileToUpload: File) => {
        return (
          uploadedFile.name === fileToUpload.name &&
          uploadedFile.lastModified === fileToUpload.lastModified
        );
      };
      if (files.length === 0) {
        tempo.fields[index] = { ...tempo.fields[index], files: [] };
        setGalleries(0);
        return tempo;
      }// @ts-ignore
      const oldFiles = tempo.fields[index].files || [];
      let newFiles = conjunctMethods.intersection(oldFiles, files, isSameFile);
      if (newFiles.length === 0) {
        newFiles = [...oldFiles, ...files];
      }
      // @ts-ignore
      tempo.fields[index].files = newFiles;
      setGalleries(newFiles.length);
      return tempo;
    });
  };
  let title = `Drag 'n' drop some files here, or click to select files. Selected ${
    item['files']?.length || 0
  } of ${MAX_NUM_GALLERIES} allowed`;
  return (
    <Grid item xs={12}>
      <FileUpload
        onChange={(files: File[]) => {
          updateFields(files, index);
        }}
        accept={[
          ...ALLOWED_FILE_EXTENSIONS['gallery'],
          ALLOWED_FILE_EXTENSIONS['video'],
          'image/*'
        ]} //this should accept images from camera
        multiple
        // @ts-ignore
        disabled={item.files?.length >= MAX_NUM_GALLERIES}
        // @ts-ignore
        value={item.files}
        title={title}
        maxFiles={MAX_NUM_GALLERIES}
        maxSize={toBytes(FILE_LIMITS['gallery'].totalMbPerFile, 'MB')}
      />
    </Grid>
  );
}
