import * as requestFromServer from './Crud';
import { globalSlice, callTypes, parseJwt } from './Slice';
import store from '../store';
import { createNextState } from '@reduxjs/toolkit';

export const { actions } = globalSlice;
