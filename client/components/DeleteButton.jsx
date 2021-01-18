import React from "react";
import { Button, Icon } from "semantic-ui-react";
import { useMutation, gql } from "@apollo/client";
import { useRouter } from "next/router";
import Swal from "sweetalert2";

const DELETE_POST = gql`
  mutation deletePost($id: ID!) {
    deletePost(id: $id)
  }
`;
const GET_POSTS = gql`
  query getPosts {
    getPosts {
      id
      body
      likes {
        id
        username
        created
      }
      comments {
        id
        username
        body
        created
      }
      username
      created
      likesCount
      commentsCount
    }
  }
`;

const DeleteButton = ({ id }) => {
  const router = useRouter();
  const [deletePost] = useMutation(DELETE_POST, {
    update(cache, { data: { deletePost } }) {
      //get object from cache
      const { getPosts } = cache.readQuery({
        query: GET_POSTS,
      });
      //obdate cache
      cache.writeQuery({
        query: GET_POSTS,
        data: {
          getPosts: getPosts.filter((post) => post.id !== id),
        },
      });
    },
  });
  const handleRemove = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { data } = await deletePost({
            variables: {
              id,
            },
          });
          Swal.fire("Deleted!", data.deletePost, "success");
          if (router.pathname === "/post/[pid]") {
            router.push("/");
          }
        } catch (error) {
          console.log(error);
        }
      }
    });
  };
  return (
    <Button
      onClick={handleRemove}
      size="tiny"
      as="div"
      color="red"
      floated="right"
    >
      <Icon name="trash" style={{ margin: 0 }} />
    </Button>
  );
};

export default DeleteButton;
