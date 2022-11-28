import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const CssTextField = withStyles ({
    root: {
      '& label.Mui-focused': {
        color: 'grey',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'grey',
      },
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: 'grey',
        },
      }
    },
  
})(TextField);

export default CssTextField