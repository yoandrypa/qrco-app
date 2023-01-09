import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import Grid from '@mui/material/Grid';
import { conjunctMethods, toBytes } from '../../../utils';
import { ALLOWED_FILE_EXTENSIONS, FILE_LIMITS } from '../../../consts';
import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Common from '../helperComponents/Common';
import Topics from './helpers/Topics';
import { isValidUrl } from '../../../utils';
import RenderTextFields from './helpers/RenderTextFields';
import { DataType, LinkType } from '../types/types';
import Expander from './helpers/Expander';
import socialsAreValid from './validator';
import { Button, Menu, MenuItem, Typography } from '@mui/material';
import FileUpload from 'react-material-file-upload';
import RenderChipFields from './helpers/RenderChipFields';
import RenderContactForm from '../helperComponents/smallpieces/RenderContactForm';
//@ts-ignore
import session from "@ebanux/ebanux-utils/sessionStorage";
interface LinkedLabelDataProps {
  data: DataType;
  setData: Function;
  handleValues: Function;
  setIsWrong: (isWrong: boolean) => void;
}

const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
  userSelect: 'none',
  background: isDragging ? '#ebe8e1' : 'none',
  ...draggableStyle
});

const categoryOptions = [
  'Art',
  'Dishes',
  'Glasses',
  'Jewelry',
  'Packaging',
  'Shoes',
  'Toys',
  'Clothing'
];

export default function LinkedLabelData({
  data,
  setData,
  handleValues,
  setIsWrong
}: LinkedLabelDataProps) {
  const [expander, setExpander] = useState<string | null>(null);
  const [galleries, setGalleries] = useState<number>(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const MAX_NUM_GALLERIES = 5;

  const { currentAccount } = session;

  const handleClickAddField = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseAddField = () => {
    setAnchorEl(null);
  };
  const handleCategories = (payload: string[]) => {
    console.log({ payload });
    setData((prev: DataType) => {
      const tempo = { ...prev };
      tempo.categories = payload;
      return tempo;
    });
  }

  const remove = (index: number) => {
    setData((prev: DataType) => {
      const tempo = { ...prev };
      tempo.fields = tempo.fields?.filter((_, i) => i !== index);
      return tempo;
    });
  }

  const onDragEnd = (result: any) => {
    if (!result?.destination) {
      return null;
    }

    setData((prev: DataType) => {
      const tempo = { ...prev };
      const newFields = Array.from(tempo.fields || []);
      const [removed] = newFields.splice(result.source.index, 1);
      newFields.splice(result.destination.index, 0, removed);
      tempo.fields = newFields;
      return tempo;
    });
  };
  const handleChangeText = (item: string, index: number, value: string) => {
    setData((prev: DataType) => {
      const tempo = { ...prev };
      // @ts-ignore
      tempo.fields[index][item] = value;
      return tempo;
    });
  }

  const handleAddTextField = () => {
    setData((prev: DataType) => {
      const tempo = { ...prev };
      if (!tempo.fields) {
        tempo.fields = [];
      }
      tempo.fields?.push({ type: 'text', title: '', text: '' });
      return tempo;
    });
    setExpander(data.fields ? (data.fields.length - 1).toString() : '0');
  };
  const updateFields = (files: File[], index: number) => {
    setData((prev: DataType) => {
      const tempo = { ...prev };
      if (!tempo.fields) {
        tempo.fields = [];
      }
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
      }
      const oldFiles = tempo.fields[index].files || [];
      let newFiles = conjunctMethods.intersection(oldFiles, files, isSameFile);
      if (newFiles.length === 0) {
        newFiles = [...oldFiles, ...files];
      }
      tempo.fields[index].files = newFiles;
      setGalleries(newFiles.length);
      return tempo;
    });
  };

  const handleAddMediaField = () => {
    setData((prev: DataType) => {
      const tempo = { ...prev };
      if (!tempo.fields) {
        tempo.fields = [];
      }
      tempo.fields?.push({ type: 'media', files: [] });
      return tempo;
    });
    setExpander(data.fields ? (data.fields.length - 1).toString() : '0');
  }

  const handleAddContactForm = () => {
    setData((prev: DataType) => {
      const tempo = { ...prev };
      if (!tempo.fields) {
        tempo.fields = [];
      }
      tempo.fields?.push({ type: 'contact', tittle: '', message: '', buttonText: '', email: currentAccount.email });
      return tempo;
    });
    setExpander(data.fields ? (data.fields.length - 1).toString() : '0');
  }

  const renderItem = (item: string, label: string, required?: boolean, placeholder?: string) => {
    let isError = false as boolean;
    // @ts-ignore
    const value = data?.[item] || ('' as string);

    if (value.trim().length) {
      const dl = value.trim().length;
    }

    return (
      <RenderTextFields
        item={item}
        label={label}
        isError={isError}
        value={value}
        handleValues={handleValues}
        required={item === 'petName' || required}
        placeholder={placeholder}
      />
    );
  };
  const renderFields = (item: any, index: number) => {
    switch (item.type) {
      case 'text':
        return (
          <Grid container key={index}>
            <Grid item xs={12}>
              <RenderTextFields
                handleValues={(e: any) => {
                  handleChangeText('title', index, e.target.value);
                }}
                label="Title"
                value={item.title}
              />
            </Grid>
            <Grid item xs={12}>
              <RenderTextFields
                handleValues={(e: any) => {
                  handleChangeText('text', index, e.target.value);
                }}
                label="Description"
                value={item.text}
                multiline
              />
            </Grid>
            <Grid item xs={12} sx={{ pl: 1 }}>
              <Typography fontSize={10} color="textSecondary">
                *At least one field most be filled
              </Typography>
            </Grid>
          </Grid>
        );
      case 'contact':
        return (
          <RenderContactForm
            // email={item.email}
            title={item.title}
            buttonText={item.buttonText}
            messagePlaceholder={item.message}
            handleChange={handleChangeText}
            index={index}
          />
        );
      case 'media':
        let title = `Drag 'n' drop some files here, or click to select files. Selected ${item['files']?.length || 0
          } of ${5} allowed`;
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
              disabled={item.files?.length >= 5}
              // @ts-ignore
              value={item.files}
              title={title}
              maxFiles={5}
              maxSize={toBytes(FILE_LIMITS['gallery'].totalMbPerFile, 'MB')}
            />
          </Grid>
        );
    }
  };

  const renderLabelTitle = (type: string) => {
    let fieldtype;
    switch (type) {
      case 'text':
        fieldtype = 'Title + Description field';
        break;
      case 'contact':
        fieldtype = 'Contact Form';
        break;
      default:
        fieldtype = 'Media field'
        break;
    }
    return fieldtype;
  }

  useEffect(() => {
    let isWrong = false;
    if (
      !data?.title?.trim().length
    ) {
      isWrong = true;
    }
    setIsWrong(isWrong);
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  // useEffect(() => {
  //   if (!data.links?.length) {
  //     setData((prev: DataType) => ({
  //       ...prev,
  //       links: [{ label: '', link: '' }]
  //     }));
  //   }
  // }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    // smart Label msg
    <Common msg="Linked Label">
      <Topics message="Main info" top="3px" />
      <Grid container>
        <Grid item xs={12}>
          {renderItem('title', 'Title', true)}
        </Grid>
        <Grid item xs={12}>
          {renderItem('about', 'Description',)}
        </Grid>
      </Grid>
      <Topics message="Categories" top="3px" />
      <Grid container>
        <Grid item xs={12} md={6}>
          <RenderChipFields values={data.categories ? data.categories : []} handleValues={handleCategories} />
        </Grid>
        <Grid container item xs={12} md={6}
          justifyContent="flex-end"
          alignItems="center"
        >
          <Button
            id="add-field"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            variant="outlined"
            onClick={handleClickAddField}
            size="large"
          >
            Add field
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleCloseAddField}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem onClick={() => {
              handleAddTextField();
              handleCloseAddField();
            }}>Add text field</MenuItem>
            <MenuItem onClick={() => {
              handleAddMediaField();
              handleCloseAddField();
            }}
              disabled={galleries >= MAX_NUM_GALLERIES}
            >Add Media Field</MenuItem>
            <MenuItem onClick={() => {
              handleAddContactForm();
              handleCloseAddField();
            }}

            >Add Contact Form Field</MenuItem>
          </Menu>
        </Grid>
      </Grid>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided: any) => (
            <TableContainer sx={{}}>
              <Table size="small">
                <TableBody {...provided.droppableProps} ref={provided.innerRef}>
                  {data.fields?.map((x: any, index: number) => {
                    const itemId = `item-${index}`;
                    return (
                      <Draggable
                        key={itemId}
                        draggableId={itemId}
                        index={index}
                        isDragDisabled={data.fields?.length === 1}>
                        {(provided: any, snapshot: any) => (
                          <TableRow
                            sx={{ p: 0, width: '100%' }}
                            key={`trow${index}`}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style
                            )}>
                            <TableCell
                              sx={{
                                p: 0,
                                pr: 1,
                                width: '40px',
                                borderBottom: 'none'
                              }}>
                              {/* @ts-ignore */}
                              {data.fields.length > 1 && (
                                <DragIndicatorIcon
                                  sx={{
                                    color: theme => theme.palette.text.disabled
                                  }}
                                />
                              )}
                            </TableCell>
                            <TableCell
                              sx={{
                                p: 0,
                                pr: 1,
                                width: '95%',
                                borderBottom: 'none'
                              }}>
                              <Paper elevation={2} sx={{ p: 1, mt: 1 }}>
                                <Expander
                                  expand={expander}
                                  setExpand={() =>
                                    setExpander(
                                      index.toString() === expander
                                        ? ''
                                        : index.toString()
                                    )
                                  }
                                  item={`item-${index}`}
                                  title={renderLabelTitle(x.type)}
                                  deleteButton
                                  handleDelete={() => remove(index)}
                                />
                                {expander === index.toString() && (
                                  <>{renderFields(x, index)}</>
                                )}
                              </Paper>
                            </TableCell>
                          </TableRow>
                        )}
                      </Draggable>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Droppable>
      </DragDropContext>
    </Common>
  );
}
