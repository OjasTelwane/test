import axios from "axios";

export const fileUpload = (files) => {
  const data = new FormData();
  data.append('file', files[0] )
  return axios.post('file', data);
}
