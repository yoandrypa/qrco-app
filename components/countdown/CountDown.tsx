import React, { useLayoutEffect, useState } from "react";
import style from "./CountDown.module.css";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import Router from "next/router";
import Stack from "@mui/material/Stack";
import pluralize from "pluralize";

type Props = {
  /**
   * Start date of the trial period (createdAt field of user profile)
   */
  startDate: number | string | Date;
}

const CountDown = (props: Props) => {
  const [days, setDays] = useState<number>(14);
  const [hours, setHours] = useState<number>(23);
  const [minutes, setMinutes] = useState<number>(59);
  const [seconds, setSeconds] = useState<number>(59);
  const [trialIsOver, setTrialIsOver] = useState<boolean>(false);

  function flipAllCards(time: number): void {
    const seconds = time % 60;
    setDays(Math.floor(time / 86400));
    setHours(Math.floor((time / 3600) / 14));
    setMinutes(Math.floor(time / 60) % 60);
    setSeconds(time % 60);
    // console.log(days, hours, minutes,seconds)
  }

  useLayoutEffect(() => {
    const initialDate = new Date(props.startDate);
    const countToDate = (initialDate.setDate(initialDate.getDate() + 14)); //new Date().setDate(new Date().getDate() + 14)
    let previousTimeBetweenDates;
    const now = new Date();
    if (countToDate <= Number(now)) {
      setTrialIsOver(true);
    } else {
      const interval = setInterval(() => {

        const currentDate = Number(new Date());
        const timeBetweenDates = Math.ceil((countToDate - currentDate) / 1000);
        if (timeBetweenDates <= 0) {
          setTrialIsOver(true);
          clearInterval(interval);
        } else {
          flipAllCards(timeBetweenDates);
          previousTimeBetweenDates = timeBetweenDates;

          if (days <= 0 && hours <= 0 && minutes <= 0 && seconds <= 0) {
            setTrialIsOver(true);
          }
        }

      }, 1000);

      return () => clearInterval(interval);
    }

// eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trialIsOver]);

  if (trialIsOver) {
    return (
      <Alert severity="error" onClick={() => Router.push(`/plans`)}>
        <Typography sx={{ display: {xs: 'none', lg: 'block'}}}>
          {'Your 14 days of free trial has ended. You must buy a plan to keep using the platform. Click here to go to the pricing page.'}
        </Typography>
        <Typography sx={{ display: {lg: 'none', xs: 'block'}}}>
          {'Free trial ended. Go to pricing.'}
        </Typography>
      </Alert>
    );
  } else {
    return (
      <>
        <Alert severity="warning" onClick={() => Router.push(`/plans`)}>
          <Stack direction="row" spacing={1}>
            <Typography>
              You are in trial mode. Please subscribe to a plan here. Your free trial ends in:
            </Typography>
            <div className={".MuiAlert-standardWarning"}>
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
            </div>
          </Stack>
        </Alert>
      </>
    );
  }

};

export default CountDown;
