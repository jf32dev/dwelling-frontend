import {
    CHECK_ADD, 
    CHECK_REMOVE
} from "../types";

export const check_add = data => ({
    type: CHECK_ADD, 
    payload: data
})

export const check_remove = data => ({
    type: CHECK_REMOVE, 
    payload: data
})