import request from 'axios'
import * as workspaceApi from '@/api/workspaceApi'

export default workspaceApi

/**
 * 当前用户有权限的工作空间
 *
 * @param param
 * @returns {Promise<AxiosResponse<T>>}
 */
export function workspaceList(param) {
  return request.post("/workspace/list", param);
}

/**
 * 当前用户的工作空间
 *
 * @returns {Promise<AxiosResponse<T>>}
 */
export function currentWorkspace() {
  return request.post("/workspace/currentWorkspace");
}

/**
 * 切换工作空间
 *
 * @param newWorkspaceId
 * @returns {Promise<AxiosResponse<T>>}
 */
export function changeWorkspace(newWorkspaceId) {
  return request.post("/workspace/change", {
    "id": newWorkspaceId
  });
}
