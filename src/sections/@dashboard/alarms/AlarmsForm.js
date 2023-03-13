import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
// @mui
import { styled } from '@mui/material/styles';
import {
  Link,
  Stack,
  IconButton,
  InputAdornment,
  TextField,
  Checkbox,
  FormControlLabel,
  RadioGroup,
  Radio,
  Typography,
  Button,
  Grid,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
} from '@mui/material';
// components
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import useAlarms from '../../../hooks/useAlarms';
import { useStateContext } from '../../../context/ContextProvider';

const schema = yup.object().shape({
  name: yup.string().required(),
  trigger: yup.number().required().positive().integer(),
});

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const StyledSection = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: 480,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  boxShadow: theme.customShadows.card,
  backgroundColor: theme.palette.background.default,
}));

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

const metrics = [
  {
    value: 'CPU',
    label: 'CPU',
  },
  {
    value: 'MEM',
    label: 'MEM',
  },
  {
    value: 'File System',
    label: 'File System',
  },
];
// ----------------------------------------------------------------------

export default function AlarmsForm() {
  const { id } = useParams();
  const { getDataxId, createData, updateData } = useAlarms();
  const navigate = useNavigate();
  const [alarm, setAlarm] = useState({});
  const { setAlertC} = useStateContext();

  const {
    setValue,
    watch,
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  watch();

  const onSubmitHandler = async (data) => {

    if (id) {
      const res = await updateData(data);
      setAlertC({open:true,action:1});
      console.log(res, "upd");
    } else {
      const res = await createData(data);
      setAlertC({open:true,action:0});
      console.log(res, "add");
    }
    reset();
    navigate('/dashboard/alarms', { replace: true, upd: true });
  };

  const onCancelHandler = () => {
    reset();
    navigate('/dashboard/alarms', { replace: true });
  };




  useEffect(() => {
    const getData = async () => {
      const res = await getDataxId(id);
      console.log(res,"res");
      setValue('metric',res.metric );
      setAlarm(res);
    };

    console.log(id);
    if (id) {
      getData();
    }
  }, []);

  // effect runs when user state is updated
  useEffect(() => {
    // reset form with user data

    reset(alarm);
  }, [alarm]);


  return (
    <>
      <StyledContent>
        <Typography variant="h4" gutterBottom>
          Create new Alarm
        </Typography>
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <Stack spacing={3}>
            <TextField
              type="text"
              name="name"
              label={errors.name ? 'Error' : 'Name'}
              color={errors.name?.message ? 'error' : 'primary'}
              InputLabelProps={{ shrink: true, }}
              helperText={errors.name?.message}
              {...register('name')}
            />

            <TextField
              name="source"
              label="Source"
              InputLabelProps={{ shrink: true }}
              {...register('source', { required: 'Source is required' })}
            />


            <TextField
              select
              fullWidth
              label="Metric"
              inputProps={register('metric', {
                required: 'Please enter metric',
              })}
              error={errors.metrics}
              helperText={errors.metrics?.message}
            >
              {metrics.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <Stack spacing={3} direction="row">
              <FormControlLabel
                defaultChecked
                control={<Checkbox />}
                label={">"}
                {...register('upper')}
              />
              <TextField
                type="number"
                name="trigger"
                label={errors.trigger ? 'Error' : 'Trigger'}
                color={errors.trigger?.message ? 'error' : 'primary'}
                InputLabelProps={{ shrink: true, }}
                helperText={errors.trigger?.message}
                {...register('trigger')}
              />
            </Stack>
            <FormControlLabel
              control={<Checkbox name="paused" label="Paused" {...register('paused')} />}
              label="Paused"
            />
          </Stack>

          <Grid container spacing={2} sx={{ marginTop: 3, mx: 2 }}>
            <Grid item>
              <Button size="large" type="buttom" variant="contained" onClick={onCancelHandler}>
                Cancel
              </Button>
            </Grid>
            <Grid item>
              <Button size="large" type="submit" variant="contained">
                {id?"Update":"Create"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </StyledContent>
    </>
  );
}
