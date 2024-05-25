// src/PropertyTable.tsx
import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TableSortLabel, Paper
} from '@mui/material';
import { Link } from 'react-router-dom';

type SortColumn = 'address' | 'price' | 'bedrooms' | 'bathrooms' | 'squareFootage';

const PropertyTable: React.FC<any> = ({ properties }) => {
  const [sortConfig, setSortConfig] = useState<{ key: SortColumn; direction: 'asc' | 'desc' } | null>(null);

  const sortedProperties = [...properties].sort((a, b) => {
    if (!sortConfig) return 0;

    const { key, direction } = sortConfig;
    let aValue: string | number = a[key];
    let bValue: string | number = b[key];

    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  const requestSort = (key: SortColumn) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel
                active={sortConfig?.key === 'address'}
                direction={sortConfig?.direction || 'asc'}
                onClick={() => requestSort('address')}
              >
                Address
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortConfig?.key === 'price'}
                direction={sortConfig?.direction || 'asc'}
                onClick={() => requestSort('price')}
              >
                Price
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortConfig?.key === 'bedrooms'}
                direction={sortConfig?.direction || 'asc'}
                onClick={() => requestSort('bedrooms')}
              >
                Bedrooms
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortConfig?.key === 'bathrooms'}
                direction={sortConfig?.direction || 'asc'}
                onClick={() => requestSort('bathrooms')}
              >
                Bathrooms
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortConfig?.key === 'squareFootage'}
                direction={sortConfig?.direction || 'asc'}
                onClick={() => requestSort('squareFootage')}
              >
                Square Footage
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel>
                Actions
              </TableSortLabel>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedProperties.map((property) => (
            <TableRow key={property.id}>
              <TableCell>{property.address}</TableCell>
              <TableCell>{property.price}</TableCell>
              <TableCell>{property.bedrooms}</TableCell>
              <TableCell>{property.bathrooms}</TableCell>
              <TableCell>{property.squareFootage}</TableCell>
              <TableCell><Link to={`/offers/${property.id}/${property?.address}`}>
                  Make Offer
              </Link></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PropertyTable;
