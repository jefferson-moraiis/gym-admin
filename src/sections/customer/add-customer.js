import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Link, Stack, TextField, Typography,Modal, Select, MenuItem,InputLabel,FormControl,Input } from '@mui/material';
import { subDays, subHours } from 'date-fns';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { TextMaskCustom } from '../../components/mask';



const now = new Date();
export const AddCustomer = (props) => {
  const theme = useTheme();
  const isXSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const style = {
    position: 'absolute',
    top: '50%',
    left: isXSmall ? '0%' : '50%', // Ajusta left com base no tamanho da tela
    transform: isXSmall ? 'translate(0%, -50%)' : 'translate(-50%, -50%)',
    width: {
      xs: '90%',     // Utiliza 90% da largura da tela em dispositivos muito pequenos
      sm: 600,       // 600px em telas médias
      md: 800,       // 800px em telas grandes
    },
    maxWidth: '100%',  // Evitar que o componente seja maior que a tela
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    mx: 2,             // Margens nas laterais
    flexGrow: 1,
    py: 8
  };
  const formik = useFormik({
    initialValues: {
      email: '',
      name: '',
      lastName: '',
      password: '',
      age: 0,
      phone: '',
      role: '',
      submit: null
    },
    validationSchema: Yup.object({
      email: Yup
        .string()
        .email('Must be a valid email')
        .max(255)
        .required('Email é obrigatório'),
      name: Yup
        .string()
        .max(255)
        .required('Name é obrigatório'),
      lastName: Yup
        .string()
        .max(255)
        .required('Sobrenome é obrigatório'),
      role: Yup
        .string()
        .max(255)
        .required('Permissão é obrigatório'),
      age: Yup
        .number()
        .required('Idade é obrigatório'),
      phone: Yup
        .string()
        .max(255)
        .required('N° de celular é obrigatório'),
    }),
    onSubmit: async (values, helpers) => {
      try {
        const newCustomer = {
          email: values.email,
          name: values.name,
          lastName: values.lastName,
          password: values.password,
          age: values.age,
          role: values.role,
          phone: values.phone
        }
        props.onAddCustomer(newCustomer);
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
        
    }
  });

  return (
    <>
      <div>
          <Box sx={style}>
          <form
              noValidate
              onSubmit={formik.handleSubmit}
            >
              <Stack spacing={3}>
                <TextField
                  error={!!(formik.touched.name && formik.errors.name)}
                  fullWidth
                  helperText={formik.touched.name && formik.errors.name}
                  label="Nome"
                  name="name"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.name}
                />
                <TextField
                  error={!!(formik.touched.lastName  && formik.errors.lastName)}
                  fullWidth
                  helperText={formik.touched.lastName && formik.errors.lastName}
                  label="Sobrenome"
                  name="lastName"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.lastName}
                />
                <TextField
                  error={!!(formik.touched.email && formik.errors.email)}
                  fullWidth
                  helperText={formik.touched.email && formik.errors.email}
                  label="Email"
                  name="email"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="email"
                  value={formik.values.email}
                  inputComponent={TextMaskCustom}
                />
                <TextField
                  error={!!(formik.touched.password && formik.errors.password)}
                  fullWidth
                  helperText={formik.touched.password && formik.errors.password}
                  label="Senha"
                  name="password"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="password"
                  value={formik.values.password}
                />
                <FormControl 
                  fullWidth 
                  variant="filled"
                  error={!!(formik.touched.role && formik.errors.role)}>
              <InputLabel id="demo-simple-select-label">Permissão</InputLabel>
              <Select
                name="role"
                value={formik.values.role}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                label="Permissão"
              >
                <MenuItem value={"user"}>ALUNO</MenuItem>
                <MenuItem value={"admin"}>ADMINISTRADOR</MenuItem>
              </Select>
              {formik.touched.role && formik.errors.role && (
                <Typography color="error">
                  {formik.errors.role}
                </Typography>
              )}
            </FormControl>
            <FormControl 
                  fullWidth 
                  variant="filled"
                  error={!!(formik.touched.role && formik.errors.role)}>
              <InputLabel htmlFor="formatted-text-mask-input">N° Celular</InputLabel>
              <Input
                id="formatted-text-mask-input"
                inputComponent={TextMaskCustom}
                error={!!(formik.touched.phone && formik.errors.phone)}
                fullWidth
                helperText={formik.touched.phone && formik.errors.phone}
                label="N° de Celular"
                name="phone"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="phone"
                value={formik.values.phone}
              />
            </FormControl>
            <TextField
                  error={!!(formik.touched.age && formik.errors.age)}
                  fullWidth
                  helperText={formik.touched.age && formik.errors.age}
                  label="Idade"
                  name="age"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="number"
                  value={formik.values.age}
                />
              </Stack>
              {formik.errors.submit && (
                <Typography
                  color="error"
                  sx={{ mt: 3 }}
                  variant="body2"
                >
                  {formik.errors.submit}
                </Typography>
              )}
              <Button
                fullWidth
                size="large"
                sx={{ mt: 3 }}
                type="submit"
                variant="contained"
              >
                Salvar
              </Button>
            </form>
          </Box>
      </div>
    </>
  );
};

