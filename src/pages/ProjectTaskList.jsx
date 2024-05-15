import React, { useState } from 'react';
import { VStack, Card, CardBody, Flex, Box, Checkbox, IconButton, Button } from '@chakra-ui/react';
import { FaQrcode, FaLink } from 'react-icons/fa';
import TaskDeviceLinker from './TaskDeviceLinker'; // Import the TaskDeviceLinker component

const ProjectTaskList = ({ tasks, selectedTasks, handleCheckboxChange, formatTaskDisplay, openModal, setSerialNumber, setDeviceId, linkDevice, setSelectedTaskForModal }) => {
  const [visibleLinkerTaskId, setVisibleLinkerTaskId] = useState(null); // State to manage which task's linker is visible

  const toggleLinkerVisibility = (task) => {
    if (visibleLinkerTaskId === task.id) {
      setVisibleLinkerTaskId(null); // Hide if the same button is clicked again
      setSelectedTaskForModal(null); // Clear the selected task for the modal
    } else {
      setVisibleLinkerTaskId(task.id); // Show linker for the clicked task
      setSelectedTaskForModal(task)
    }
  };

  return (
    <VStack align="stretch" spacing={4}>
      {tasks.map((task) => (
        <Card key={task.id} mb={2} width="100%"   style={{ 
            padding: '10px', 
            margin: '5px', 
            border: '1px solid #ccc', 
            backgroundColor: task.deviceInfo ? 'lightgreen' : 'white' 
          }} 
        >
          <CardBody p={4}>
            <Flex>
              <Box>
                <Checkbox pr={4} isChecked={selectedTasks.has(task.id)} onChange={() => handleCheckboxChange(task.id)} />
              </Box>
              <Box flex="1" style={{ fontSize: "smaller" }}>
                <p><b>{formatTaskDisplay(task)}</b></p>
                <p>Created at: {new Date(task.created_at).toLocaleDateString()}</p>
                <p>ID: {task.id}</p>
              </Box>
              <IconButton icon={<FaQrcode />} ml={2} size="md" aria-label="Link Device" colorScheme="blue" onClick={() => openModal(task)} />
              <Button leftIcon={<FaLink />} colorScheme="blue" size="sm" onClick={() => toggleLinkerVisibility(task)}>
                {visibleLinkerTaskId === task.id ? 'Hide Linker' : 'Link Device'}
              </Button>
            </Flex>
            {visibleLinkerTaskId === task.id && (
              <TaskDeviceLinker
                setSerialNumber={setSerialNumber}
                setDeviceId={setDeviceId}
                linkDevice={() => linkDevice(task.id)}
              />
            )}
          </CardBody>
        </Card>
      ))}
    </VStack>
  );
};

export default ProjectTaskList;