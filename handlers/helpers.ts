// @ts-ignore
export const query = async (req, res, next) => {
  const { limit, skip, all } = req.query;
  const { admin } = req.user || {};

  req.query.limit = parseInt(limit) || 10;
  req.query.skip = parseInt(skip) || 0;

  if (req.query.limit > 50) {
    req.query.limit = 50;
  }

  req.query.all = admin ? all === "true" : false;

  next();
};


export const handleFetchResponse = async (fetchResponse: Response): Promise<any | Error> => {
  if (!fetchResponse.ok) {
    if (!fetchResponse.status) {
      return new Error('Ops, something went wrong. Check your Internet connection.')
    }
    let result: Error;
    switch (fetchResponse.status) {
      case 401:
      case 403:
        result = new Error('Access denied. Your session might expired, try login again')
        break;
      case 500:
      case 400:
      case 502:
        result = new Error('Ops, something went wrong. Don\'t worry, our team is working on it.')
        break;
      default:
        result = new Error(`Error ${fetchResponse.status} ${fetchResponse?.statusText}`)
        break;
    }
    return result;
  }
  try {
    return await fetchResponse.json()
  } catch (error) {
    //this will rarely happen
    return new Error('Bad Request. Error decoding JSON response');
  }
}

export const handleVerifier = (router: any, isDynamic: boolean, userLogged: boolean, selected: string | null,
                               setLoading: (loading: boolean) => {}, setStep: (step: number) => {}, step: number,
                               target: number) => {
  if ((isDynamic && !userLogged) || !selected) {
    const path = {pathname: '/'};

    if (isDynamic && !userLogged) { // @ts-ignore
      path.query = {login: true};
    }

    router.push(path, "/")
      .then(() => {
        setLoading(false);
      });
  } else if (step !== target && selected) {
    setStep(target);
  }
};
