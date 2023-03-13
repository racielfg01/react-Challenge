import { useEffect, useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { filter} from 'lodash';
import {  sub } from 'date-fns';
import { faker } from '@faker-js/faker';

// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  Fab,
  Chip,
  Box,
  Collapse,
  Alert,
} from '@mui/material';
// components
import Label from '../components/label';
import Iconify from '../components/iconify';
// sections
import ListHead from '../sections/@dashboard/alarms/ListHead';
import ListToolbar from '../sections/@dashboard/alarms/ListToolbar';
// mock
// import ALARMSLIST from '../_mock/alarms';
import useAlarms from '../hooks/useAlarms';
import { useStateContext } from '../context/ContextProvider';
import Scrollbar from '../components/scrollbar/Scrollbar';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'source', label: 'Source', alignRight: false },
  { id: 'metric', label: 'Metric', alignRight: false },
  { id: 'trigger', label: 'Trigger', alignRight: false },
  { id: 'paused', label: 'Paused', alignRight: false },
  { id: 'actions', label: 'Actions', alignRight: false },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
if(array!== -1){
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);

}
return [];
}

const style = {
  margin: 0,
  top: 'auto',
  right: 20,
  bottom: 20,
  left: 'auto',
  position: 'fixed',
};

export function TransitionAlerts() {
  const { alertC, setAlertC} =useStateContext();
  const [open, setOpen] = useState(false);
  let title="";
  if(alertC.action===0){
    title="Alarm added successfully"
  }else if(alertC.action===1){
    title="Alarm update successfully"
  }else{
    title="Alarm delete successfully"
  }
  useEffect(()=>{
    setOpen(alertC.open)
  },[alertC])


  return (
    <Box sx={{ width: '100%' }}>
      <Collapse in={open}>
      <Alert variant="filled" severity="success"
      action={
        <IconButton
          aria-label="close"
          color="inherit"
          size="small"
          onClick={() => {
            setOpen(false);
          }}
        >
           <Iconify icon="eva:close-fill" />
        </IconButton>
      }
      sx={{ mb: 2,color:'white' }}
      >

  {title}
</Alert>
    
      </Collapse>
   
    </Box>
  );
}



export default function AlarmsPage() {

  const navigate = useNavigate();
  const { setNotifications,setAlarmsC,setAlarmsA,alertC,setAlertC} = useStateContext();

  const { getData, deleteData } = useAlarms();
  const [alarms, setAlarms] = useState([]);
  const [metricData, setMetricData] = useState([]);
  const [selectedAlarm, setSelectedAlarm] = useState(null);


  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [activeAlarms, setActiveAlarms] = useState([]);

  const handleOpenMenu = (event, item) => {
    setSelectedAlarm(item);
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = alarms.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleNew = () => navigate('/dashboard/alarms/new', { replace: true });

  const remove = async () => {
    setOpen(false);
    const newAlarms = alarms.filter((alarm) => alarm.id !== selectedAlarm.id);
    setAlarms(newAlarms);
   
    const res = await deleteData(selectedAlarm.id);
    console.log(res);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - alarms.length) : 0;

  const filteredAlarms = applySortFilter(alarms, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredAlarms.length && !!filterName;

   // Para usarlo con las notificaciones
   const fakeData = [
    { id: 1, name: "CPU", metrica: faker.random.numeric() },
    { id: 2, name: "MEM", metrica: faker.random.numeric() },
    { id: 3, name: "FS", metrica: faker.random.numeric() },
  ];

  const getCpuNotification = (item, noti) => {
    if(item.upper && Number(metricData[0].metrica)>=(Number(item.trigger))){
      setNotifications(notifications=>[...notifications,noti]);
    }else if(item.upper===false&&(Number(metricData[0].metrica)<Number(item.trigger))){
      setNotifications(notifications=>[...notifications,noti]);
    }
    }
  
  const getMemNotification = (item,noti) => {
    if(item.upper && (Number(item.trigger)>=Number(metricData[1].metrica))){
      setNotifications(notifications=>[...notifications,noti]);
    }else if(item.upper===false&&(Number(item.trigger)<Number(metricData[1].metrica))){
      setNotifications(notifications=>[...notifications,noti]);
    }
    }

  const getFsNotification = (item, noti) => {
    if(item.upper && (Number(item.trigger)>=Number(metricData[2].metrica))){
      setNotifications(notifications=>[...notifications,noti]);
    }else if(item.upper===false&&(Number(item.trigger)<Number(metricData[2].metrica))){
      setNotifications(notifications=>[...notifications,noti]);
    }
    }

  const throwMetricActions = (item) => {
    const desc=item.upper?`Metric greater than or equal to ${item.metric} trigger`
    :`Metric less than or equal to ${item.metric} trigger`;

    const noti={
      id: faker.datatype.uuid(),
      title: `${item.name} is Activate`,
      description: desc,
      avatar: null,
      type: 'mail',
      createdAt: sub(new Date(), { days: 2, hours: 3, minutes: 30 }),
      isUnRead: true,
    };
   
    switch (item.metric) {
      case 'File System':
         getFsNotification(item,noti);
        break;
      case 'CPU': 
      getCpuNotification(item,noti);
        break;
      case 'MEM':
         getMemNotification(item,noti);
        break;
      default:
        break;
    }
  }

  const getDataList = async () => {
    const res = await getData();
      setAlarms(res);
      setAlarmsC(res);
  };


  useEffect(() => {
    getDataList();
    if(alarms.length){
      const aAlm= alarms.filter(e=>e.paused===false);
      setActiveAlarms(aAlm);
      setAlarmsA(aAlm);
    }
  }, []);


  useEffect(() => {
    // simulate async api call with set timeout
    const revisarAlarm = () => {
      activeAlarms.map(item => {
        throwMetricActions(item);
        return -1;
      })
    }

    setTimeout(() => setMetricData(fakeData), 1000);
    revisarAlarm();
    
  }, [metricData]);

  useEffect(() => {
      setTimeout(() => setAlertC({open:false,action:0}), 5000);
  }, [alertC]);
  
  

  return (
    <>
      <Helmet>
        <title> Alarms | Minimal UI </title>
      </Helmet>

      <Container>

      {alertC && <TransitionAlerts />}
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Alarms
          </Typography>
        </Stack>

    

        <Fab variant="contained" color="primary" sx={style} onClick={handleNew}>
          New
        </Fab>
        {metricData.length > 0 &&
          <Card sx={{ m: 3, py: 2 }}>
            <Chip sx={{ mx: 2 }} label={`CPU: ${metricData[0].metrica} %`} />
            <Chip sx={{ mx: 2 }} label={`MEM: ${metricData[1].metrica} %`} />
            <Chip sx={{ mx: 2 }} label={`FS: ${metricData[2].metrica} %`} />
          </Card>
        }
        <Card>
          <ListToolbar numSelected={selected.length} 
          filterName={filterName} onFilterName={handleFilterByName} />
        <Scrollbar>
          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              <ListHead
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={alarms.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
                onSelectAllClick={handleSelectAllClick}
              />
              <TableBody>
                {filteredAlarms.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                  const { id, name, source, metric, trigger, paused, upper } = row;
                  const selectedUser = selected.indexOf(name) !== -1;

                  return (
                    <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                      <TableCell padding="checkbox">
                        <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, name)} />
                      </TableCell>

                      <TableCell component="th" scope="row" padding="none">
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Typography variant="subtitle2" noWrap>
                            {name}
                          </Typography>
                        </Stack>
                      </TableCell>

                      <TableCell align="left">{source}</TableCell>

                      <TableCell align="left">{metric}</TableCell>

                      <TableCell align="left">
                        {`${upper ? '>' : '<'} ${trigger} %`}
                      
                      </TableCell>

                      <TableCell align="left">
                        <Label color={paused ? 'success' : 'error'}>{paused.toString()}</Label>
                      </TableCell>

                      <TableCell align="left">
                        <IconButton size="large" color="inherit" onClick={(event) => handleOpenMenu(event, row)}>
                          <Iconify icon={'eva:more-vertical-fill'} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>

              {isNotFound && (
                <TableBody>
                  <TableRow>
                    <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                      <Paper
                        sx={{
                          textAlign: 'center',
                        }}
                      >
                        <Typography variant="h6" paragraph>
                          Not found
                        </Typography>

                        <Typography variant="body2">
                          No results found for &nbsp;
                          <strong>&quot;{filterName}&quot;</strong>.
                          <br /> Try checking for typos or using complete words.
                        </Typography>
                      </Paper>
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
          </TableContainer>
          </Scrollbar>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={alarms.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>


      {selectedAlarm &&
        <Popover
          open={Boolean(open)}
          anchorEl={open}
          onClose={handleCloseMenu}
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{
            sx: {
              p: 1,
              width: 140,
              '& .MuiMenuItem-root': {
                px: 1,
                typography: 'body2',
                borderRadius: 0.75,
              },
            },
          }}
        >
          <Link to={`/dashboard/alarms/edit/${selectedAlarm.id}`}>
            <MenuItem>
              <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
              Edit
            </MenuItem>
          </Link>

          <MenuItem sx={{ color: 'error.main' }} onClick={()=>{setAlertC({open:true,action:2}); remove()}}>
            <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
            Delete
          </MenuItem>
          {selectedAlarm.paused
            ?
            <MenuItem sx={{ color: 'success.main' }}>
              <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
              Resume
            </MenuItem>
            :
            <MenuItem sx={{ color: 'error.main' }}>
              <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
              Paused
            </MenuItem>
          }
        </Popover>
      }
    </>
  );
}

