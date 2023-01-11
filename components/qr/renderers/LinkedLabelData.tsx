import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import { conjunctMethods, toBytes } from '../../../utils';
import { ALLOWED_FILE_EXTENSIONS, FILE_LIMITS } from '../../../consts';
import Common from '../helperComponents/Common';
import Topics from './helpers/Topics';
import RenderTextFields from './helpers/RenderTextFields';
import { DataType } from '../types/types';
import { Button, Menu, MenuItem, Typography } from '@mui/material';
import FileUpload from 'react-material-file-upload';
import RenderChipFields from './helpers/RenderChipFields';
import RenderDragDrop from './helpers/RenderDragDrop';
import RenderContactForm from '../helperComponents/smallpieces/RenderContactForm';
import RenderGallerySection from '../helperComponents/smallpieces/RenderGallerySection';
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
  const MAX_NUM_GALLERIES = 6;
  
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

  const handleAddMediaField = (type:'media'|'gallery'|'video' = 'media') => {
    setData((prev: DataType) => {
      const tempo = { ...prev };
      if (!tempo.fields) {
        tempo.fields = [];
      }
      tempo.fields?.push({ type: type, files: [] });
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
      tempo.fields?.push({ type: 'contact', title: '', message: '', buttonText: '', email: currentAccount.email });
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
          <>
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
          </>
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
      case 'gallery':
      case 'video':
        let accept:string[] = [];
        if (item.type === 'media') {
          accept = [
            ...ALLOWED_FILE_EXTENSIONS['gallery'],
            ALLOWED_FILE_EXTENSIONS['video'],
            'image/*'
          ];
        } else if (item.type === 'video') {
          accept = [ALLOWED_FILE_EXTENSIONS['video']];
        } else {
          accept = [...ALLOWED_FILE_EXTENSIONS['gallery'], 'image/*'];
        }
        return (
          <RenderGallerySection
            setData={setData}
            index={index}
            item={item}
            accept={accept}
          />
        );
    }
  };

  const renderLabelTitle = (type: string) => {
    let fieldType;
    switch (type) {
      case 'text':
        fieldType = 'Title + Description Section';
        break;
      case 'contact':
        fieldType = 'Contact Section';
        break;
      case 'gallery':
        fieldType = 'Gallery Section';
        break;
      case 'video':
        fieldType = 'Video Section';
        break;
      default:
        fieldType = 'Media Section'
        break;
    }
    return fieldType;
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

  return (
    // smart Label msg
    <Common msg="Smart Link">
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
            }}>Title + Description </MenuItem>
            <MenuItem onClick={() => {
              handleAddMediaField('gallery');
              handleCloseAddField();
            }}
              disabled={galleries >= MAX_NUM_GALLERIES}
            >Gallery</MenuItem>
            <MenuItem onClick={() => {
              handleAddMediaField('video');
              handleCloseAddField();
            }}
              disabled={galleries >= MAX_NUM_GALLERIES}
            >Video</MenuItem>
            <MenuItem onClick={() => {
              handleAddContactForm();
              handleCloseAddField();
            }}

            >Contact Form</MenuItem>
          </Menu>
        </Grid>
      </Grid>
      <RenderDragDrop fields={data.fields?data.fields.map((field, index) =>{
        return {
          ...field,
          header: renderLabelTitle(field.type),
          component:renderFields(field, index)};
      })
        :[]}  setData={setData}/>
    </Common>
  );
}
