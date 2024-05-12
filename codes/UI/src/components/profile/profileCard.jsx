import Cropper from 'react-easy-crop';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { useRef, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Slider from '@mui/material/Slider';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { alpha, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery'; 

import { bgGradient } from 'src/theme/css';

import Iconify from 'src/components/iconify';

import { useAuth } from 'src/sections/login/authContext';


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

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = pixelCrop.width * scaleX;
    canvas.height = pixelCrop.height * scaleY;

    if (rotation !== 0) {
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.translate(-canvas.width / 2, -canvas.height / 2);
    }

    ctx.drawImage(
        image,
        pixelCrop.x * scaleX,
        pixelCrop.y * scaleY,
        pixelCrop.width * scaleX,
        pixelCrop.height * scaleY,
        0,
        0,
        pixelCrop.width * scaleX,
        pixelCrop.height * scaleY
    );

    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          resolve(URL.createObjectURL(blob));
        }, 'image/jpeg');
    });
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
    const [slideState, setSlideState] = useState(false);
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
    const { updateUser } = useAuth();

    const getUserData = () => {
        const userDataString = localStorage.getItem('userData') || sessionStorage.getItem('userData')
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

    const updateUserImgUrl = (newImgUrl) => {
        const userDataString = localStorage.getItem('userData') || sessionStorage.getItem('userData')
        if (userDataString) {
          const userData = JSON.parse(userDataString);

          userData.imgurl = newImgUrl;
      
          localStorage.setItem('userData', JSON.stringify(userData));
          updateUser(userData)
        }
      };
    
    const userData = getUserData();

    useEffect(() => {
        if (userData?.imgurl !== 'undefined'){
            setAvatar(true)
        }
    }, [userData])

    const onCropComplete = useCallback(async (croppedArea, _croppedAreaPixels) => {
        const newImage = await getCroppedImg(
            image, 
            _croppedAreaPixels 
        );
        setCroppedImage(newImage); 
    }, [image]);

    const onFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setImage(reader.result);
                setSlideState(true)
            });
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleFileInputClick = () => {
        fileInputRef.current.click();
    };

    const handleOpenPopup = () => setOpen(true);

    const handleClosePopup = () => setOpen(false);

    const handleRotate = () => {
        setRotation((prevRotation) => prevRotation - 90);
    }

    const handleBack = () => {
        setSlideState(false);
        setImage(null);
    }

    const handleSave = async () => {
        if (!croppedImage) {
            console.error("No image cropped yet");
            return;
        }
    
        setLoading(true);

        const response = await fetch(croppedImage);
        const blob = await response.blob();
        const file = new File([blob], `${userData?.user}-profile-pic.png`, { type: "image/png" });

        const formData = new FormData();
        formData.append("profilePic", file);
        formData.append("username", userData?.user);
        formData.append("email", userData?.email);

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/file/profile-img`, {
                method: 'POST',
                body: formData,
            });
    
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            console.log(res)
    
            const result = await res.text();
            updateUserImgUrl(result);

        } catch (error) {
            console.error("Error uploading the image:", error);
        } finally {
            setImage(null);
            setLoading(false);
            setOpen(false);
        }
    };

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
                        src={avatar ? `${import.meta.env.VITE_API_URL}/file/user-profile/${userData?.imgurl}` : "None"}
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
                        {`${userData?.fname} ${userData?.lname}`}
                    </Typography>
                    <Typography
                        color="text.secondary"
                        variant="body2"
                        sx={{
                        fontSize: { xs: '0.875rem', sm: '1rem' }, // Adjust for readability on xs screens
                        }}
                    >
                        {userData?.user}
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
<<<<<<< HEAD
                        {t('Upload picture')}
=======
                        Upload picture
>>>>>>> 29ec6ef19632cb6ca37b352c02ef5f9ed59a920c
                    </Button>
                </CardActions>
            </Card>
            <Modal
                open={open}
                onClose={handleClosePopup}
                aria-labelledby="upload-picture-modal-title"
            >
                    <Box 
                        sx={{
                            ...bgGradient({
                            color: image ? theme.palette.background.default : alpha(theme.palette.background.paper, 0.9),
                            imgUrl: '/assets/background/overlay_4.jpg',
                            }),
                            position: 'relative',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            [theme.breakpoints.up('sm')]: {
                            width: '60%',
                            height: '40%'
                            },
                            [theme.breakpoints.up('md')]: {
                            width: '100%',
                            height: '100%',
                            maxWidth: '30vw',
                            maxHeight: '50vh',
                            },
                            [theme.breakpoints.up('xs')]: {
                                width: '100%',
                                height: '100%',
                                maxWidth: '80vw',
                                maxHeight: '40vh',
                            },
                            backgroundColor: image ? theme.palette.background.default : alpha(theme.palette.background.paper, 0.9),
                            borderRadius: '16px',
                            p: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            overflow: 'hidden',
                    }}>
                        {!image && (
                            <Box className={!slideState ? 'slide-out-transition' : 'slide-in-transition'} sx={{position: 'relative', width: "100%", height:"85%", display: 'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', flexGrow: 1, p: 4,}}>
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
                                    height: '100%',
                                    }}>
                                    <input {...getInputProps()} />
                                    {
                                        isDragActive ?
                                        <Typography sx={{width:"100%", height:"100%"}}>Drop the image here ...</Typography> :
                                        <Box sx={{
                                            width:"100%",
                                            position: 'relative',
                                            pt: '100%',
                                        }}>
                                            <Avatar sx={{top:0, left:0, position: 'absolute', width:"100%", height:"100%" }}/>
                                        </Box>
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
                            </Box>
                        )}
                        {image && (
                            <Box className={slideState ? 'slide-in-transition' : 'slide-out-transition'} sx={{position: 'relative', width: "100%", height:"85%", display: 'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', flexGrow: 1, p:4}}>
                                <IconButton
                                    onClick={handleBack}
                                    sx={{
                                        position: 'absolute',
                                        left: 8,
                                        top: 8,
                                        zIndex: 2,
                                    }}
                                >
                                    <Iconify icon="eva:arrow-back-fill" />
                                </IconButton>
                                <Box 
                                    sx={{ 
                                        width: '100%', 
                                        height: '100%', 
                                        position: 'relative', 
                                        display:'flex', 
                                        alignItems:'center', 
                                        justifyContent:'center', 
                                        flexGrow: 1,
                                        p: 0,
                                        m: 0,
                                    }}
                                >
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
                                        style={{width:"100%", height:"auto"}}
                                    />
                                    <Box sx={{
                                        position: 'fixed',
                                        width: '100%',
                                        height: '100%',
                                        zIndex: 0,
                                        background: `radial-gradient(circle closest-side at center, transparent 60%, ${theme.palette.background.default} 60%)`,
                                        pointerEvents: 'none',
                                    }} />
                                    {
                                    isDesktop && (
                                        <Slider
                                            orientation='vertical'
                                            value={zoom}
                                            min={1}
                                            max={3}
                                            step={0.1}
                                            onChange={(e) => setZoom(Number(e.target.value))}
                                            sx={{
                                                position: 'absolute',
                                                right: 0,
                                                bottom: 0,
                                                zIndex: 2,
                                                height: "70%",
                                                mb: 8
                                            }}
                                        />
                                        )
                                    }
                                    <IconButton 
                                        onClick={handleRotate}
                                        sx={{
                                            position: 'absolute',
                                            right: 0,
                                            bottom: 0,
                                            zIndex: 2,
                                        }}
                                    >
                                        <Iconify icon="eva:refresh-outline" />
                                    </IconButton>
                                </Box>
                                <LoadingButton
                                    fullWidth
                                    size="large"
                                    variant="contained"
                                    onClick={handleSave}
                                    sx={{ 
                                        backgroundColor: theme.palette.text.primary, 
                                        color: theme.palette.background.paper,
                                        '&:hover': { 
                                            backgroundColor: theme.palette.text.secondary,
                                            color: theme.palette.background.paper
                                        },
                                        mt: 2,
                                    }}
                                    loading={loading}
                                >
                                    {t('Save')}
                                </LoadingButton>
                            </Box>
                        )}
                    </Box>
                </Modal>
        </>
    )
  };
