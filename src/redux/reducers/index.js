import {
    CHECK_ADD,
    CHECK_REMOVE
} from "../types";

export default (state, action) => {
    switch (action.type) {
        case CHECK_ADD:
            return {
                checkers: [{
                    cardNumber: action.payload.cardNumber,
                    balance: action.payload.balance,
                }, ...(state?.checkers?state?.checkers:[])]
            }
        case CHECK_REMOVE:
            return {
                checkers: state.checkers.filter((item, index) => index != action.payload.index)
            }
        default:
            return {
                ...state
            }
    }
}