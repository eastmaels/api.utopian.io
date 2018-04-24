const createClient = require('lightrpc').createClient;
const bluebird = require('bluebird');
const rpcClient = createClient('https://api.steemit.com');
bluebird.promisifyAll(rpcClient);

export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

export const getBlock = (blockNum) => rpcClient.send({ method: 'get_block', params: [blockNum] }, null);

export const getOpsInBlock = (blockNum, onlyVirtual = false) => rpcClient.send({ method: 'get_ops_in_block', params: [blockNum, onlyVirtual] }, null);

export const getGlobalProps = () => rpcClient.send({ method: 'get_dynamic_global_properties', params: [] }, null);

export const mutliOpsInBlock = (start, limit, onlyVirtual = false) => {
  const request = [];
  for (let i = start; i < start + limit; i++) {
    request.push({ method: 'get_ops_in_block', params: [i, onlyVirtual]});
  }
  return rpcClient.send(request, { timeout: 20000 });
};

export const getBlockOps = (block) => {
  const operations = [];
  block.transactions.forEach(transaction => {
    operations.push(...transaction.operations);
  });
  return operations;
};
