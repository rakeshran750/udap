import api from "./axios";

/**
 * Generic API request
 * @param {string} method - get | post | put | delete
 * @param {string} url
 * @param {object} data
 * @param {object} params
 */


export const apiRequest = async ({
  method = "get",
  url,
  data = {},
  params = {},
}) => {
  return api({
    method,
    url,
    data,
    params,
  });
};
