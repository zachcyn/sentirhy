import Cropper from 'react-easy-crop';
import { useDropzone } from 'react-dropzone';
import { useRef, useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {    Avatar,    Box,    Button,    Card,    CardActions,    CardContent,    Divider,    Typography  } from '@mui/material';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
  
import { alpha, useTheme } from '@mui/material/styles';

import { bgGradient } from 'src/theme/css';

import Iconify from 'src/components/iconify';

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous'); // needed to avoid cross-origin issues on CodeSandbox
    image.src = url;
  });

const getCroppedImg = async (imageSrc, pixelCrop, rotation = 0) => {
const image = await createImage(imageSrc);
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

// draw the rotated image on the canvas

// convert canvas to blob or data URL and return
};
  

export const AccountProfile = () => {
    const { t } =  useTranslation();
    const theme = useTheme();
    const fileInputRef = useRef();
    const [avatar, setAvatar] = useState(false)
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [image, setImage] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [rotation, setRotation] = useState(0);
    const [zoom, setZoom] = useState(1);
    const [croppedImage, setCroppedImage] = useState(null);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

    const getUserData = () => {
        const userDataString = localStorage.getItem('userData') || sessionStorage.getItem('userData');
        if (userDataString) {
            try {
            return JSON.parse(userDataString);
            } catch (e) {
            console.error("Error parsing user data:", e);
            return null;
            }
        }
        return null;
        };
    
    const userData = getUserData();

    useEffect(() => {
        if (userData.img !== 'undefined'){
            setAvatar(true)
        }
    }, [userData])

    const onCropComplete = useCallback(async (croppedArea, _croppedAreaPixels) => {
        const newImage = await getCroppedImg(
            image, // Use the 'image' state which has the image data URL
            _croppedAreaPixels // Use the local parameter from the callback
            // rotation // Include rotation if needed
        );
        setCroppedImage(newImage); 
    }, [image]);

    const onFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () => setImage(reader.result));
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleFileInputClick = () => {
        fileInputRef.current.click();
    };

    const handleOpenPopup = () => setOpen(true);

    const handleClosePopup = () => setOpen(false);

    // const handleSave = async () => {
    //     setLoading(true);
    //     try {
    //         const croppedImage = await getCroppedImg(
    //             image,
    //             croppedAreaPixels,
    //             rotation
    //         );
    //         // Upload logic here...
            
    //         setLoading(false);
    //         handleClosePopup();
    //     } catch (e) {
    //         console.error(e);
    //         setLoading(false);
    //     }
    // };

    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        const reader = new FileReader();
        reader.onloadend = () => {
          setImage(reader.result);
        };
        reader.readAsDataURL(file);
      }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    return (
        <>
            <Card>
                <CardContent>
                    <Box
                    sx={{
                        pt: 5,
                        alignItems: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                    >
                    <Avatar
                        src={avatar ? userData.img : "/broken-image.jpg"}
                        sx={{
                        height: { xs: 60, sm: 80 },
                        mb: 2,
                        width: { xs: 60, sm: 80 },
                        }}
                    />
                    <Typography
                        gutterBottom
                        variant="h5"
                        sx={{
                        fontSize: { xs: '1.25rem', sm: '1.5rem' }, // Smaller font size on xs screens
                        }}
                    >
                        {`${userData.fname} ${userData.lname}`}
                    </Typography>
                    <Typography
                        color="text.secondary"
                        variant="body2"
                        sx={{
                        fontSize: { xs: '0.875rem', sm: '1rem' }, // Adjust for readability on xs screens
                        }}
                    >
                        {userData.user}
                    </Typography>
                    </Box>
                </CardContent>
                <Divider />
                <CardActions>
                    <Button
                        fullWidth
                        variant="text"
                        onClick={handleOpenPopup}
                        sx={{
                            padding: { xs: '8px 0', sm: '16px 0' }, // Increase padding for a larger touch target on xs screens
                        }}
                    >
                        Upload picture
                    </Button>
                </CardActions>
            </Card>
            <Modal
                open={open}
                onClose={handleClosePopup}
                aria-labelledby="upload-picture-modal-title"
            >
                <Box sx={{
                        ...bgGradient({
                        color: alpha(theme.palette.background.default, 0.9),
                        imgUrl: '/assets/background/overlay_4.jpg',
                        }),
                        position: 'relative',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '90vw',
                        [theme.breakpoints.up('sm')]: {
                        width: '60%',
                        height: '40%'
                        },
                        [theme.breakpoints.up('md')]: {
                        width: '30vw',
                        height: '45%'
                        },
                        bgcolor: image ? 'black' : alpha(theme.palette.background.paper, 0.9), // Black background if an image is uploaded
                        borderRadius: '16px',
                        p: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1300,
                }}>
                    <IconButton
                        onClick={handleClosePopup}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                        }}
                    >
                        <Iconify icon="eva:close-fill" />
                    </IconButton>
                    <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: 3 }}>
                        Upload Profile Image
                    </Typography>
                    <div {...getRootProps()} style={{
                        border: isDragActive ? '2px dashed #eeeeee' : 'transparent',
                        borderRadius: '5px',
                        padding: '20px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        width: '50%',
                        height: '80%',
                        }}>
                        <input {...getInputProps()} />
                        {
                            isDragActive ?
                            <Typography sx={{width:"100%", height:"100%"}}>Drop the image here ...</Typography> :
                            <Avatar sx={{width:"100%", height:"100%"}}/>
                        }
                        </div>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={onFileChange}
                        style={{ display: 'none' }} 
                        ref={fileInputRef} 
                    />
                    <LoadingButton
                        fullWidth
                        size="large"
                        variant="contained"
                        onClick={handleFileInputClick}
                        sx={{ 
                            backgroundColor: theme.palette.text.primary, 
                            color: theme.palette.background.paper,
                            '&:hover': { 
                                backgroundColor: theme.palette.text.secondary,
                                color: theme.palette.background.paper
                            },
                            mt: 2
                        }}
                        loading={loading}
                    >
                        {t('Upload image')}
                    </LoadingButton>
                    {image && (
                        <>
                            <Cropper
                                image={image}
                                crop={crop}
                                rotation={rotation}
                                zoom={zoom}
                                aspect={1}
                                onCropChange={setCrop}
                                onRotationChange={setRotation}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                            />
                            <Box sx={{
                                    position: 'absolute', // Overlay absolute to cover Cropper
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    background: `radial-gradient(circle at center, transparent 50%, ${theme.palette.background.paper})`, // Circular transparent gradient
                                    pointerEvents: 'none', // Allow clicks through overlay
                                }} />
                            <LoadingButton
                                fullWidth
                                size="large"
                                variant="contained"
                                onClick={() => onCropComplete(crop, croppedAreaPixels)}
                                sx={{ 
                                    backgroundColor: theme.palette.text.primary, 
                                    color: theme.palette.background.paper,
                                    '&:hover': { 
                                        backgroundColor: theme.palette.text.secondary,
                                        color: theme.palette.background.paper
                                    },
                                    mt: 2
                                }}
                                loading={loading}
                            >
                                {t('Save')}
                            </LoadingButton>
                        </>
                    )}
                </Box>
            </Modal>
        </>
    )
  };
