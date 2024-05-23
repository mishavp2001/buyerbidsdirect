// src/components/HouseTable.tsx
import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Paper
} from '@mui/material';

interface House {
  id: number;
  type: string;
  price: number;
  location: string;
  size: number;
  lot: number;
}

const initialHouses: House[] = [
  { id: 1, type: 'Apartment', price: 250000, location: 'New York', size: 850, lot: 0 },
  { id: 2, type: 'House', price: 450000, location: 'Los Angeles', size: 1300, lot: 1500 },
  { id: 3, type: 'Condo', price: 300000, location: 'Chicago', size: 950, lot: 0 },
  { id: 4, type: 'Villa', price: 750000, location: 'Miami', size: 2000, lot: 2500 },
];

type Order = 'asc' | 'desc';

const ListItems: React.FC = () => {
  const [houses, setHouses] = useState<House[]>(initialHouses);
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof House>('price');

  const handleRequestSort = (property: keyof House) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortHouses = (houses: House[], comparator: (a: House, b: House) => number) => {
    const stabilizedHouses = houses.map((el, index) => [el, index] as [House, number]);
    stabilizedHouses.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedHouses.map(el => el[0]);
  };

  const getComparator = (order: Order, orderBy: keyof House) => {
    return order === 'desc'
      ? (a: House, b: House) => (b[orderBy] < a[orderBy] ? -1 : 1)
      : (a: House, b: House) => (a[orderBy] < b[orderBy] ? -1 : 1);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'type'}
                direction={orderBy === 'type' ? order : 'asc'}
                onClick={() => handleRequestSort('type')}
              >
                Type
              </TableSortLabel>
            </TableCell>
            <TableCell align="right">
              <TableSortLabel
                active={orderBy === 'price'}
                direction={orderBy === 'price' ? order : 'asc'}
                onClick={() => handleRequestSort('price')}
              >
                Price
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'location'}
                direction={orderBy === 'location' ? order : 'asc'}
                onClick={() => handleRequestSort('location')}
              >
                Location
              </TableSortLabel>
            </TableCell>
            <TableCell align="right">
              <TableSortLabel
                active={orderBy === 'size'}
                direction={orderBy === 'size' ? order : 'asc'}
                onClick={() => handleRequestSort('size')}
              >
                Size (sqft)
              </TableSortLabel>
            </TableCell>
            <TableCell align="right">
              <TableSortLabel
                active={orderBy === 'lot'}
                direction={orderBy === 'lot' ? order : 'asc'}
                onClick={() => handleRequestSort('lot')}
              >
                Lot (sqft)
              </TableSortLabel>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortHouses(houses, getComparator(order, orderBy)).map((house) => (
            <TableRow key={house.id}>
              <TableCell>{house.type}</TableCell>
              <TableCell align="right">${house.price.toLocaleString()}</TableCell>
              <TableCell>{house.location}</TableCell>
              <TableCell align="right">{house.size.toLocaleString()}</TableCell>
              <TableCell align="right">{house.lot.toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ListItems;
