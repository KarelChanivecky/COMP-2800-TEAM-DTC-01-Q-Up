import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import BoothEnterName from '../components/boothEnterName';
import BoothTicketInfo from '../components/boothTicketInfo';
import { Grid, Typography } from '@material-ui/core';
import '../styles/booth.scss';
import BoothDisabledInfo from 'src/components/boothDisabledInfo';
import BoothLoadingInfo from 'src/components/boothLoading';

enum boothStates{
   loading,
   closed,
   accepting,
   serving
}
/**
 * Renders a booth page.
 */
export default function Booth() {
   const axiosConfig = {
      headers: {
         Authorization: `Bearer ${JSON.parse(sessionStorage.user).token}`,
      },
   };

   const [boothInfo, setBoothInfo] = useState({
      state: boothStates.loading, 
      name: '',
      ticketNumber: '',
      password: '',
   });

   // fetch flag
   const [getData, setGetData] = useState(true);

   useEffect(() => {
      if (!getData) {
         return;
      }
      setGetData(false);

      axios
      .get('/getQueue', axiosConfig)
      .then((res:any) => {
         const data = res.data.queue;
         setBoothInfo((prevState:any) => ({
            ...prevState,
            state: data.isActive ? boothStates.accepting : boothStates.closed,
         }));
      })
      .catch((err:any) => {
         if (err.response.status === 332) {
            window.location.href = '/login';
         }
         console.error(err);
      });

   }, [getData, axiosConfig]);

   // handle done button click, to be passed to child BoothTicketInfo
   const onDone = () => {
      setBoothInfo((prevState) => ({
         ...prevState,
         state: boothStates.loading,
         name: '',
         ticketNumber: '',
         password: '',
      }));
      setGetData(true);
   };

   const InfoSection = () => {
      switch (boothInfo.state) {
         case boothStates.closed:
            return <BoothDisabledInfo/>;
         case boothStates.accepting:
            return <BoothEnterName setBoothInfo={setBoothInfo} />;
         case boothStates.serving:
            return <BoothTicketInfo onDone={onDone} data={boothInfo}/>;
         case boothStates.loading:
            return <BoothLoadingInfo />
      }
      return <> </>;
   };


   return (
      <>
         <Header/>
         <main>
            <section className="boothInfoSectionContainer">
               <InfoSection />
            </section>
            <Grid container justify='center'>
               <Grid container item className='textContainer' xs={12} justify="center" alignItems="center">
                  <Typography className='boothFeatureHeadings' variant='h2'>
                     How it works
                  </Typography>
                  <Grid item xs={8}>
                  <Typography variant="body2" align="left">
                     <ol className="orderedList">
                        <li>1 - Enter your name</li>
                        <li>2 - Press queue up</li>
                        <li>3 - Get your ticket number and your code city</li>
                        <li>4 - Look for your ticket number in the queue display</li>
                        <li>5 - When your turn comes, state your code city to the queue keeper</li>
                     </ol>
                  </Typography>
                  </Grid>
               </Grid>
               <Grid item ></Grid>
               {/* <Grid className='textContainer' item xs={4}>
                  <Typography className='boothFeatureHeadings' variant='h2'>
                     Estimated
                  </Typography>
                  <Typography>
                     Esitmeted wait time and the current ticket number being
                     served is displayed on the store display screen. The screen
                     is so big you can see it from a mile away so that you can
                     wait anywhere without having to worry you will miss your
                     turn.
                  </Typography>
               </Grid>
               <Grid className='textContainer' item xs={4}>
                  <Typography className='boothFeatureHeadings' variant='h2'>
                     Easy
                  </Typography>
                  <Typography>
                     When it is your turn to enter the store, all you need is
                     the password you got when you check in. Just tell our staff
                     the password he will let you in. That's it. Happy shopping.
                  </Typography>
               </Grid> */}
            </Grid>
         </main>
      </>
   );
}
