const ErrorCode = require('../../constants/errorCodes');

function createError(message, statusCode, code = ErrorCode.INTERNAL_ERROR) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.code = code;
  return error;
}

function parsePagination(query, defaultSort, allowedSortFields) {
  const page = Math.max(Number.parseInt(query.page || '1', 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(query.limit || '10', 10) || 10, 1), 100);
  const search = query.search ? String(query.search).trim() : '';
  const sort = query.sort ? String(query.sort).trim() : `${defaultSort}:asc`;
  const [sortFieldRaw, sortDirectionRaw] = sort.split(':');
  const sortField = allowedSortFields.has(sortFieldRaw) ? sortFieldRaw : defaultSort;
  const sortDirection = String(sortDirectionRaw || 'asc').toLowerCase() === 'desc' ? 'DESC' : 'ASC';

  return { page, limit, search, sortField, sortDirection };
}

module.exports = {
  createError,
  parsePagination,
};

