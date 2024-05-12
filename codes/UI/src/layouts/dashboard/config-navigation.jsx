import SvgColor from 'src/components/svg-color';
<<<<<<< HEAD
=======

>>>>>>> 29ec6ef19632cb6ca37b352c02ef5f9ed59a920c
// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard',
    icon: icon('ic_analytics'),
  },
  // {
  //   title: 'user',
  //   path: '/user',
  //   icon: icon('ic_user'),
  // },
  // {
  //   title: 'product',
  //   path: '/products',
  //   icon: icon('ic_cart'),
  // },
  // {
  //   title: 'blog',
  //   path: '/blog',
  //   icon: icon('ic_blog'),
  // },
  {
<<<<<<< HEAD
    title: 'emotion',
=======
    title: 'Emotion',
>>>>>>> 29ec6ef19632cb6ca37b352c02ef5f9ed59a920c
    path: '/emotion',
    icon: icon('ic_faceid'),
  },
];

export default navConfig;
