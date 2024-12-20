import { gql } from '@apollo/client';

export const ACTIVE_USER = gql`
  query ActiveUser {
    activeUser
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($lastActive: String!) {
    createUser(lastActive: $lastActive)
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($lastActive: String!) {
    updateUser(id: $id, lastActive: $lastActive)
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser {
    deleteUser
  }
`;
