import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import MainMicrosite from "./MainMicrosite";
import {getColors, handleDownloadFiles} from "./renderers/helper";
import {download} from "../../../handlers/storage";
import {ColorTypes, FileType} from "../types/types";
import DownloadIcon from "@mui/icons-material/Download";
import Button from "@mui/material/Button";
import pluralize from "pluralize";
import CircularProgress from "@mui/material/CircularProgress";
import RenderPreviewVideo from "./renderers/RenderPreviewVideo";
import RenderPreview from "./renderers/RenderPreview";
import RenderPreviewPdf from "./renderers/RenderPreviewPdf";

interface FileProps {
  newData: any;
}

// newData.qrType;

export default function FileMicro({newData}: FileProps) {
  const [preview, setPreview] = useState<FileType | null>(null);
  const [_, setUnusedState] = useState(); // eslint-disable-line no-unused-vars
  const files = useRef<FileType[]>([]);

  const colors = useMemo(() => (getColors(newData)), []) as ColorTypes; // eslint-disable-line react-hooks/exhaustive-deps

  // @ts-ignore
  const forceUpdate = useCallback(() => setUnusedState({}), []);

  const getFiles = (filesInfo: object[]) => {
    try {
      filesInfo.forEach(async (x: any) => {
        const key = x.Key as string;
        const fileData = await download(key);

        // @ts-ignore
        files.current.push(fileData);
        forceUpdate();
      });
    } catch {
      console.log("error");
    }
  }

  const renderHint = (type: string, index: number) => {
    const kind = newData.qrType === 'audio' ? 'Audio track' : newData.qrType === 'video' ? 'Video track' : 'PDF document';
    return (
      <Typography sx={{width: '100%', textAlign: 'center', color: colors.p}}>
        <Typography sx={{fontWeight: 'bold', display: 'inline-block', mr: 1}}>
          {kind}
        </Typography>
        <Typography sx={{display: 'inline-block'}}>
          {`${index}/${newData.files.length} (${type})`}
        </Typography>
      </Typography>
    );
  };

  useEffect(() => {
    files.current = [];
    if (newData.files?.length) {
      getFiles(newData.files);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <MainMicrosite colors={colors} url={newData.shortlinkurl} type={newData.qrType}>
      <Box sx={{
        color: colors.s,
        position: 'fixed',
        textAlign: 'left',
        marginTop: '-33px',
        marginLeft: 2
      }}>
        <Typography sx={{ display: 'inline-block', fontWeight: 'bold' }}>{newData.qrType.toUpperCase()}</Typography>
        <Typography sx={{ display: 'inline-block', ml: 1 }}>{`(${pluralize('item', newData.files.length, true)})`}</Typography>
      </Box>
      {/* @ts-ignore */}
      {files.current.length ? files.current.map((x: FileType, index: number) => {
          const fileNumber = index + 1;
          return (
            <Box key={`mainIt${fileNumber}`} sx={{
              mt: '5px',
              width: 'calc(100% - 10px)',
              ml: '5px',
              p: 2,
              border: `solid 1px ${colors.p}`,
              borderRadius: '5px'
            }}>
              {renderHint(x.type, fileNumber)}
              {newData.qrType === 'audio' && (
                <audio preload="none" controls key={`audio${fileNumber}`} style={{width: '100%'}}>
                  <source src={x.content} type={x.type}/>
                  {'Your browser can not play audio files. :('}
                </audio>
              )}
              {newData.qrType === 'video' && newData.files.length === 1 && (
                <RenderPreviewVideo content={x.content} type={x.type} />
              )}
              {newData.qrType === 'pdf' && newData.files.length === 1 && <RenderPreviewPdf content={x.content} />}
              <Box sx={{ display: 'flex', mb: 2 }}>
                <Button
                  sx={{
                    width: '100%',
                    color: colors.p,
                    background: colors.s,
                    '&:hover': {color: colors.s, background: colors.p}
                  }}
                  variant="outlined"
                  onClick={() => handleDownloadFiles(x)}
                  startIcon={<DownloadIcon/>}
                >
                  {`Download ${newData.qrType} ${fileNumber}`}
                </Button>
                {['video', 'pdf'].includes(newData.qrType) && newData.files.length > 1 && (
                  <Button
                    sx={{
                      width: '30%',
                      ml: '5px',
                      color: colors.p,
                      background: colors.s,
                      '&:hover': {color: colors.s, background: colors.p}
                    }}
                    variant="outlined"
                    onClick={() => setPreview(x)}
                  >
                    {'Preview'}
                  </Button>
                )}
              </Box>
            </Box>
          );
        }
      ) : (
        <Box sx={{ width: '100%', textAlign: 'center', mt: 2, color: colors.p }}>
          <CircularProgress color="primary" sx={{ mr: '10px', my: 'auto', display: 'inline-block' }}/>
          <Typography sx={{ display: 'inline-block' }}>{'Please wait...'}</Typography>
        </Box>
      )}
      {preview && (
        <RenderPreview preview={preview} type={newData.qrType} colors={colors} handleClose={() => setPreview(null)} />
      )}
    </MainMicrosite>
  );
}
