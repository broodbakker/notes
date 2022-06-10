import React from 'react'
//style
import {
  Box, Textarea, Input,
} from '@chakra-ui/react'

interface INewNote {
  newNoteData: {
    title: string
    content: string
  }
  handleTitle: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void
  handleContent: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void
}

export const NewNote = ({ newNoteData, handleTitle, handleContent }: INewNote) => {
  return (
    <Box>
      <Input
        bg="white"
        variant='outline'
        placeholder='Title'
        size='sm'
        value={newNoteData.title}
        onChange={handleTitle} />

      <Textarea
        placeholder='what do you want to write about?'
        value={newNoteData.content}
        onChange={handleContent}
        bg="white"
        borderRadius={0}
        h="2xs"
      />
    </Box>
  )
}

