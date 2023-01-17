import { styled } from '@mui/material/styles';
import Button, { ButtonProps } from '@mui/material/Button';

const FlatButton = styled(Button)({
  boxShadow: 'none',
  textTransform: 'none',
  fontSize: 20,
  display: "inline block",
  width: "fit-content",
  padding: '10px 32px',
  margin: "1em auto",
  borderColor: "#fff",
  lineHeight: 1.5,
  backgroundColor: '#fff',
  fontWeight: 700,
  borderRadius: 5,

  '&:hover': {
    backgroundColor: "#fff",
    boxShadow: 'rgb(255 255 255 / 50%) 0px 2px 4px -1px, rgb(255 255 255 / 14%) 0px 2px 2px 0px, rgb(0 0 0 / 52%) 0px 1px 10px 0px'
  },

  '&:focus': {
    boxShadow: '0 0 0 0.2rem rgba(255,255,255,.05)',
  },

  '&:disabled': {
    opacity: 0.7
  }
});

export default FlatButton;