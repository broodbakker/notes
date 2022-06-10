import React, { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid';
//icons
import { MdExitToApp, MdNoteAdd, MdOutlineAdd, MdClear, MdRefresh, MdSave } from "react-icons/md"
//style
import {
  Box, Button, Text, Stack,
} from '@chakra-ui/react'
//components
import { NewNote } from "../component/newNote"
//api
import { readAll, deleteAll, createAll } from "../util/api"
//typescript
import { INoteData } from "../typescript"

interface INote {
  noteData: INoteData
  chooseNote: (noteData: INoteData, index: number) => void
  handleRemoveNote: (id: string) => void
  highlightNote: boolean
  index: number
}
//functions
const isNoteNew = (arr: INoteData[], id: string) => arr.some((arrVal) => id === arrVal.id);
const findNote = (arr: INoteData[], id: string) => arr.find((arrVal) => id === arrVal.id);
const findIndexOfNote = (arr: INoteData[], id: string) => arr.findIndex((arrVal) => id === arrVal.id);
const removeNote = (arr: INoteData[], id: string) => arr.filter((arrVal) => id != arrVal.id);
const createNote = (title = "new note", content = "") => ({
  title,
  content,
  id: uuidv4()
})
const emptyTheNote = (id: string) => ({
  title: "",
  content: "",
  id
})
const modifyDbNotes = (dbNotes: any[]): INoteData[] => dbNotes.map((dbNote) => {
  return {
    title: dbNote.data.title,
    content: dbNote.data.content,
    id: uuidv4()
  }
})
const handleSaveAll = (notesData: INoteData[]) => {
  handleDeleteAll()
  createAll(notesData).then((response) => {
  })
}
const handleDeleteAll = () => deleteAll().then((response) => { })

const Home = () => {
  const [NotesData, setNotesData] = useState([createNote()])
  const [isNoteOpen, setIsNoteOpen] = useState(false)
  const [newNoteData, setNewNoteData] = useState(createNote())
  const [highlightNote, setHighlightNote] = useState<number | null>(null)

  useEffect(() => {
    readAll().then((dbNotes) => {
      setNotesData(modifyDbNotes(dbNotes))
    })
  }, []);

  const handleContent = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setNewNoteData({ ...newNoteData, content: e.target.value });
  };
  const handleTitle = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setNewNoteData({ ...newNoteData, title: e.target.value });
  };
  const handleClear = (id: string): void =>
    setNewNoteData(emptyTheNote(id));

  const handleRemove = (id: string): void => {
    deleteNote(id)
    setNewNoteData(createNote());
    setHighlightNote(null)
    setIsNoteOpen(false)
  };
  const handleAddNote = (): void => {
    if (!isNoteOpen) {
      const newNote = createNote()
      setNewNoteData(newNote);
      addNote(newNote);
      setHighlightNote(0)
      setIsNoteOpen(true)
    }
  };
  const handleSave = (): void => {
    isNoteNew(NotesData, newNoteData.id) ? mutateNote(NotesData, newNoteData) : addNote(newNoteData)
    setHighlightNote(null)
    setIsNoteOpen(false)
    setNewNoteData(createNote())
  }

  const chooseNote = (noteData: INoteData, index: number) => {
    setIsNoteOpen(true)
    setHighlightNote(index)
    setNewNoteData(noteData)
  }
  const handleRemoveNote = (id: string) => {
    setNotesData(removeNote(NotesData, id))
    setHighlightNote(null)
    setIsNoteOpen(false)
  }
  const addNote = (newNoteData: INoteData) => setNotesData([newNoteData, ...NotesData])
  const deleteNote = (id: string) => setNotesData(removeNote(NotesData, id))
  const mutateNote = (NotesData: INoteData[], newNoteData: INoteData) =>
    setNotesData([{ ...newNoteData }, ...removeNote(NotesData, newNoteData.id)])

  return (
    <Box>
      <Box pos="relative" h="100vh" w={"100vw"}>
        {/* all notes */}
        <Box bg="blackAlpha.50" overflowY="scroll"
          maxHeight={isNoteOpen ? "30%" : "90%"}
          css={{
            '&::-webkit-scrollbar': {
              width: '20px',
            },
            '&::-webkit-scrollbar-track': {
              width: '6px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: "#2B6CB0",
              borderRadius: "10px",
              border: '5px solid transparent',
              backgroundClip: 'content-box',
            },
          }}>
          {NotesData.map((noteData, id) => <Note key={uuidv4()} noteData={noteData}
            chooseNote={chooseNote} handleRemoveNote={handleRemoveNote} highlightNote={id === highlightNote}
            index={id} />)}
        </Box>

        <Box position="fixed" bottom="0" left="0" width="100%" >
          {/* create note */}
          {isNoteOpen &&
            <Box my="2" p="2" bg="blackAlpha.200" display="flex" justifyContent="center">

              <Box width="sm" >
                <Box>
                  <NewNote newNoteData={newNoteData} handleTitle={handleTitle} handleContent={handleContent} />
                </Box>

                <Stack direction='row' spacing={4} justify="center" mt="2">
                  <Button onClick={handleSave} rightIcon={<MdOutlineAdd />} colorScheme='blue' variant='solid'>
                    Save
                  </Button>
                  <Button onClick={() => handleClear(newNoteData.id)} rightIcon={<MdRefresh />} colorScheme='blue' >
                    Clear
                  </Button>

                  <Button onClick={() => handleRemove(newNoteData.id)} rightIcon={<MdClear />} colorScheme='blue' >
                    remove
                  </Button>
                </Stack>
              </Box>
            </Box>}

          <Box px="1">
            {/* save note */}
            <Button onClick={() => handleSaveAll(NotesData)} width="full" size='lg' borderRadius={0}
              rightIcon={<MdSave size={"2rem"} />} colorScheme='green' variant='ghost'>
              <Text textStyle="button">Save</Text>
            </Button>
            {/* add note */}
            <Button onClick={handleAddNote} width="full" size='lg' borderRadius={0}
              rightIcon={<MdNoteAdd size={"2rem"} />} colorScheme='blue' variant='ghost'>
              <Text textStyle="button">Add note</Text>
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

const Note = ({ noteData, chooseNote, handleRemoveNote, highlightNote, index }: INote) => {
  return (
    <Box cursor="pointer" onClick={() => chooseNote(noteData, index)} py={3} px="5"
      borderBottom="1px"
      borderColor={"blackAlpha.200"}
      bg={highlightNote ? "blue.200" : "transparent"}
      pos="relative">
      <Stack direction='row' justifyContent={"space-between"}>
        <Text alignSelf="center">{noteData.title}</Text>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleRemoveNote(noteData.id)
          }}
          pos="relative" zIndex={1}><MdExitToApp /></Button>
      </Stack>

    </Box>
  )
}





export default Home