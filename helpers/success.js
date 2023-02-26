const endpointResponse = ({
  res,
  code = 200,
  status = true,
  message,
  meta,
  body,
  options,
}) => {
  res.status(code).json({
    status,
    code,
    message,
    meta,
    body,
    options,
  })
}

module.exports = {
  endpointResponse,
}
