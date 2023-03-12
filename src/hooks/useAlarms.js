import axios from 'axios';

const URL_API = 'https://640a1adf6ecd4f9e18c4e97d.mockapi.io/api/v1/alarms';

const useAlarms = () => {

  const getData = async () => {
    try {
      const res = await axios.get(URL_API);
      if (res.status === 200) {
        const data = await res.data;
        return data;
      }
    } catch (error) {
      console.error(error);
    }
    return -1;
  };

  const getDataxId = async (id) => {
    try {
      const res = await axios.get(URL_API, {
        params: {
          id,
        },
      });
      if (res.status === 200) {
        const data = await res.data;
        return data[0];
      }
    } catch (error) {
      console.error(error);
    }
    return -1;
  };

  const createData = async (newData) => {
    try {
      const res = await axios.post(URL_API, {
          ...newData,
      });
      if (res.statusText === 'Ok') {
        const data = await res.data;
        return data;
      }
    } catch (error) {
      console.error(error);
    }
    return -1;
  };

  const updateData = async (data) => {
    try {
      const res = await axios.put(`${URL_API}/${data.id}`, {
        ...data
      });
      if (res.status === 200) {
        const dataX = await res.data;
        return dataX;
      }
    } catch (error) {
      console.error(error);
    }
    return -1;
  };

  const deleteData = async (id) => {

    try {
      const res = await axios.delete(`${URL_API}/${id}`, {
        params: {
          id,
        },
      });
      if (res.status === 200) {
        const data = await res.data;
        return data;
      }
    } catch (error) {
      console.error(error);
    }
    return -1;
  };
//   +++++++++++++++++++++++++++++++++++++++++++

  // const handleAddAlarm = (newAlarm) => {
  //   createData(newAlarm)
  //   setAlarms([...alarms, newAlarm]);
  // };

  // const handlerRemoveAlarm = (uuid) => {
  //   deleteData(uuid);
  //   const newAlarms = alarms.filter((alarm) => alarm.uuid !== uuid);
  //   setAlarms(newAlarms);
  // };

  // const handleUpdateAlarm = (uuid) => {
  //     const newAlarms = alarms.map((alarm) => {
  //         if (alarm.uuid === uuid) {
  //             return {
  //                 ...alarm,
  //                 name: 'Yelena',
  //               };
  //           }
  //           return alarm;
  //       });
  //       updateData(newAlarms);
  //   setAlarms(newAlarms);
  // };

  // const handleResumeAlarm = (uuid) => {
  //   const newAlarms = alarms.map((alarm) => {
  //     if (alarm.uuid === uuid) {
  //       return {
  //         ...alarm,
  //         paused: true,
  //       };
  //     }
  //     return alarm;
  //   });
  //   setAlarms(newAlarms);
  // };
  // const handlePausedAlarm = (uuid) => {
  //   const newAlarms = alarms.map((alarm) => {
  //     if (alarm.uuid === uuid) {
  //       return {
  //         ...alarm,
  //         paused: false,
  //       };
  //     }
  //     return alarm;
  //   });
  //   setAlarms(newAlarms);
  // };

  return {getData,getDataxId,createData,updateData,deleteData};
};

export default useAlarms;
