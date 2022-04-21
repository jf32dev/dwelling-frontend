import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

import { Button, Card, IconButton, Input, Box, List, ListItem, Typography, Stack } from "@mui/material";
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import DragHandleIcon from '@mui/icons-material/DragHandle';

import "./main.scss";

import {
    check_add,
    check_remove
} from "../../redux/actions";
import { BASE_URL } from "../../config/config";

export default function Main() {
    // Define the sorting method
    const [order, setOrder] = useState(1);
    // Define the current Card Number
    const [cardNumber, setCardNumber] = useState("");
    // Defines whether the current card number is valid
    const [invalid, setInvalid] = useState(false);
    const dispatch = useDispatch();
    // Get the card numbers and test results checked so far from redux
    const [data] = useSelector(state => {
        var tmp = state.data.checkers;
        tmp = tmp?.sort((first, second) => order?(first.balance - second.balance):(second.balance - first.balance));
        return [tmp];
    });
    /**
     * handleChangeCardNumber
     * change cardNumber
     * @param event 
     */
    const handleChangeCardNumber = (event) => {
        setCardNumber(event.target.value);
    };
    
    /**
     * convertValidate
     * Validate variable
     * @param v
     */
    const convertValidate = (v) => {
        v = String(v);
        v = v.replace(/\s/g, '');
        v = String(Array.from(new String(v)).filter(item => Number(item) == item).join(""));
        if (v.charAt(v.length - 1) != Number(v.charAt(v.length - 1))) v = v.slice(0, -1);
        if (v.length <= 4) return v;
        else if (v.length > 4 & v.length <= 8) return v.substr(0, 4) + " " + v.substr(4, 4);
        else if (v.length > 8 & v.length <= 12) return v.substr(0, 4) + " " + v.substr(4, 4) + " " + v.substr(8, 4);
        else return v.substr(0, 4) + " " + v.substr(4, 4) + " " + v.substr(8, 4) + " " + v.substr(12, 4);
    }

    /**
     * deleteList
     * Dispatch to redux to delete the row with index v from the list.
     * @param v
     */
    const deleteList = (v) => {
        dispatch(check_remove({ index: v }));
    }

    /**
     * checker
     * Validation check is performed on the current value, and it is calculated and displayed in the backend.
     */
    const checker = () => {
        var v = cardNumber;
        if (v.charAt(v.length - 1) != Number(v.charAt(v.length - 1))) v = v.slice(0, -1);
        v = v.replace(/\s/g, '').substr(0, 16);

        if (v.length != 16) {
            setInvalid(true);
            return;
        }
        setInvalid(false);

        axios.post(BASE_URL + "/check", {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            cardNumber: v
        }).then(response => {
            if (response.data.status == 'success') {
                dispatch(check_add({ cardNumber: v, balance: response.data.balance }));
            } else {
                // error
            }
        });

        setCardNumber("");
    }

    /**
     * orderToggle
     * Set the sort method
     */
    const orderToggle = () => {
        setOrder(!order);
    }

    return (
        <Box className="main-container">
            <Card className="balance-checker-card">
                <Box className="card-header">
                    <Box className="card-header-title">
                        <Stack direction='column'>
                            <Typography variant="h4" component="h4">Balance checker</Typography>
                            <AccountBalanceIcon sx={{ fontSize: 24, color: "black" }} />
                        </Stack>
                        <Typography variant="body" component="div">Enter your card number to check it's balance.</Typography>
                    </Box>
                    <Input
                        value={convertValidate(cardNumber)}
                        onChange={handleChangeCardNumber}
                        name="cardNumber"
                        id="cardNumber"
                        placeholder="xxxx xxxx xxxx xxxx"
                    />
                </Box>
                <Typography className={"invalid " + (!invalid ? "d-none" : "")}>Invalid number</Typography>
                <Box className="card-content">
                    <Box className="content-header">
                        <Button className="check-btn" onClick={checker}>Check</Button>
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-end" }}>
                        <Typography>Order: </Typography>
                        <IconButton onClick={orderToggle}>
                            {
                                order?<KeyboardArrowUpIcon />:<KeyboardArrowDownIcon />
                            }
                        </IconButton>
                    </Box>
                    <List className="b-list">
                        {
                            data?.map((item, index) => {
                                return (
                                    <ListItem className="b-list-item" key={index}>
                                        <Typography variant="body1" component="span">Card ending in {String(item.cardNumber).slice(-4)}</Typography>
                                        <Box className="balance-wrap">
                                            <Typography variant="body1" component="span">Balance: ${+item.balance}</Typography>
                                            <DeleteForeverIcon onClick={() => deleteList(index)} sx={{ fontSize: 24, color: "black" }} />
                                        </Box>
                                    </ListItem>
                                )
                            })
                        }
                    </List>
                </Box>
            </Card>
        </Box>
    )
}