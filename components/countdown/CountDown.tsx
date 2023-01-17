import { MouseEvent, useLayoutEffect, useState } from "react";
import style from "./CountDown.module.css";
import Typography from "@mui/material/Typography";
import pluralize from "pluralize";
import Link from "next/link";
import IconButton from '@mui/material/IconButton';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { keyframes } from "@mui/system";
import Popover from "@mui/material/Popover";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";

const ring = keyframes`
  0% { transform: rotate(0deg) },
  2% { transform: rotate(-25deg) },
  4% { transform: rotate(0deg) },
  6% { transform: rotate(25deg) },
  8% { transform: rotate(0deg) },
  10% { transform: rotate(-25deg) },
  12% { transform: rotate(0deg) },
  14% { transform: rotate(25deg) },
  16% { transform: rotate(0deg) },
  18% { transform: rotate(-25deg) },
  20% { transform: rotate(0deg) },
  22% { transform: rotate(25deg) },
  24% { transform: rotate(0deg) },
`;

const grow = keyframes`
  from { transform: scale(0); opacity: 1; },
  to { transform: scale(1); opacity: 0; },
`;

type Props = {
  /**
   * Start date of the trial period (createdAt field of user profile)
   */

}

const CountDown = (props: Props) => {
  const [days, setDays] = useState<number>(14);
  const [hours, setHours] = useState<number>(23);
  const [minutes, setMinutes] = useState<number>(59);
  const [seconds, setSeconds] = useState<number>(59);
  const [subscriptionExpired, setSubscriptionExpired] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  function flipAllCards(time: number): void {
    const seconds = time % 60;
    setDays(Math.floor(time / 86400));
    setHours(Math.floor((time / 3600) / 14));
    setMinutes(Math.floor(time / 60) % 60);
    setSeconds(time % 60);
    // console.log(days, hours, minutes,seconds)
  }

  // useLayoutEffect(() => {
  //   const initialDate = new Date(props.startDate);
  //   const countToDate = (initialDate.setDate(initialDate.getDate() + 14)); //new Date().setDate(new Date().getDate() + 14)
  //   let previousTimeBetweenDates;
  //   const now = new Date();
  //   if (countToDate <= Number(now)) {
  //     setTrialIsOver(true);
  //   } else {
  //     const interval = setInterval(() => {

  //       const currentDate = Number(new Date());
  //       const timeBetweenDates = Math.ceil((countToDate - currentDate) / 1000);
  //       if (timeBetweenDates <= 0) {
  //         // setTrialIsOver(true);
  //         clearInterval(interval);
  //       } else {
  //         flipAllCards(timeBetweenDates);
  //         previousTimeBetweenDates = timeBetweenDates;

  //         // if (days <= 0 && hours <= 0 && minutes <= 0 && seconds <= 0) {
  //         //   setTrialIsOver(true);
  //         // }
  //       }

  //     }, 1000);

  //     return () => clearInterval(interval);
  //   }
  // }, [trialIsOver]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Tooltip title={`${subscriptionExpired ? "Trial has ended" : "Free mode"}. Click for details`}>
        <IconButton sx={{ ml: '5px' }} onClick={handleOpen}>
          <Box sx={{
            border: anchorEl ? 'unset' : theme => `solid 5px ${subscriptionExpired ? theme.palette.error.main : theme.palette.warning.main}`,
            width: '40px',
            height: '40px',
            position: 'absolute',
            right: 0,
            opacity: 1,
            borderRadius: '100%',
            animation: anchorEl ? 'unset' : `${grow} 2s infinite ease`
          }} />
          <NotificationsActiveIcon color="info" sx={{ animation: anchorEl ? 'unset' : `${ring} 2s infinite ease`, '&:hover': { animation: 'unset' } }} />
        </IconButton>
      </Tooltip>
      {anchorEl && (<Popover
        open
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box sx={{ p: 2, background: theme => theme.palette.info.light }}>
          {subscriptionExpired ? (
            <Typography>
              {"You're on a free account, Please Upgrade now to get access to more features. Click "}
              <span style={{ color: "blue" }}><Link href="/plans">here</Link></span>
              {" to go to the pricing page."}
            </Typography>
          ) : (
            <Typography sx={{ display: 'inline' }}>
              {"You are in free mode. Please subscribe to a plan "}
              <span style={{ color: "blue" }}><Link href="/plans">here</Link></span>
              {/* {". Your free trial ends in:"} */}
              {/* <Box className={".MuiAlert-standardWarning"} sx={{ display: 'inline-block', ml: '5px' }}>
                <div className={style.container}>
                  {days > 0 && <div className={style.container_segment}>
                    <div className={style.segment}>
                      <div className={style.flip_card} data-days-tens>
                        <div className={style.top}>{Math.floor(days / 10)}</div>
                        <div className={style.bottom}>{Math.floor(days / 10)}</div>
                      </div>
                      <div className={style.flip_card} data-days-ones>
                        <div className={style.top}>{days % 10}</div>
                        <div className={style.bottom}>{days % 10}</div>
                      </div>
                      <div></div>
                      <Typography>{pluralize("Day", days)}</Typography>
                    </div>
                  </div>}
                  {days === 0 && hours > 0 && <div className={style.container_segment}>
                    <div className={style.segment}>
                      <div className={style.flip_card} data-hours-tens>
                        <div className={style.top}>{Math.floor(hours / 10)}</div>
                        <div className={style.bottom}>{Math.floor(hours / 10)}</div>
                      </div>
                      <div className={style.flip_card} data-hours-ones>
                        <div className={style.top}>{hours % 10}</div>
                        <div className={style.bottom}>{hours % 10}</div>
                      </div>
                      <div></div>
                      <Typography>{pluralize("Hour", hours)}</Typography>
                    </div>
                  </div>}
                  {days === 0 && (hours > 0 || minutes > 0) && <div className={style.container_segment}>
                    <div className={style.segment}>
                      <div className={style.flip_card} data-minutes-tens>
                        <div className={style.top}>{Math.floor(minutes / 10)}</div>
                        <div className={style.bottom}>{Math.floor(minutes / 10)}</div>
                      </div>
                      <div className={style.flip_card} data-minutes-ones>
                        <div className={style.top}>{minutes % 10}</div>
                        <div className={style.bottom}>{minutes % 10}</div>
                      </div>
                      <div></div>
                      <Typography>{pluralize("Minute", minutes)}</Typography>
                    </div>
                  </div>}
                  {days === 0 && (hours > 0 || minutes > 0 || seconds > 0) && <div className={style.container_segment}>
                    <div className={style.segment}>
                      <div className={style.flip_card} data-seconds-tens>
                        <div className={style.top}>{Math.floor(seconds / 10)}</div>
                        <div className={style.bottom}>{Math.floor(seconds / 10)}</div>
                      </div>
                      <div className={style.flip_card} data-seconds-ones>
                        <div className={style.top}>{seconds % 10}</div>
                        <div className={style.bottom}>{seconds % 10}</div>
                      </div>
                      <div></div>
                      <Typography>{pluralize("Second", seconds)}</Typography>
                    </div>
                  </div>}
                </div>
              </Box> */}
            </Typography>
          )}
        </Box>
      </Popover>)}
    </>
  )
};

export default CountDown;
