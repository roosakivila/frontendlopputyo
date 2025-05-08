import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Button,
  ButtonGroup,
  Paper,
  Popper,
  ClickAwayListener
} from '@mui/material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import TrainingService from '../../services/TrainingService';
import { convertTrainingsToEvents, formatEventTime } from '../../utils/calendarUtils';
import { formatCustomerName } from '../../utils/formatters';

/**
 * TrainingCalendar component to display trainings in a calendar view
 * @returns {JSX.Element} The TrainingCalendar component
 */
function TrainingCalendar() {
  const [trainings, setTrainings] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [view, setView] = useState('timeGridWeek');
  const [openPopover, setOpenPopover] = useState(false);
  const [popoverEvent, setPopoverEvent] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const calendarRef = useRef(null);

  useEffect(() => {
    fetchTrainings();
  }, []);

  // Convert trainings to events when trainings change
  useEffect(() => {
    if (trainings.length > 0) {
      const calendarEvents = convertTrainingsToEvents(trainings);
      setEvents(calendarEvents);
    }
  }, [trainings]);

  // fetch trainings
  const fetchTrainings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await TrainingService.getTrainings();
      setTrainings(data);
    } catch (error) {
      console.error('Error fetching trainings:', error);
      setError('Failed to fetch trainings. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Handle view change
  const handleViewChange = (newView) => {
    setView(newView);
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.changeView(newView);
    }
  };

  // Handle event click to show popover
  const handleEventClick = (clickInfo) => {
    setPopoverEvent(clickInfo.event);
    setAnchorEl(clickInfo.el);
    setOpenPopover(true);
  };

  // Handle click away from popover
  const handleClickAway = () => {
    setOpenPopover(false);
  };

  // Handle today button click
  const handleTodayClick = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.today();
    }
  };

  // Handle previous button click
  const handlePrevClick = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.prev();
    }
  };

  // Handle next button click
  const handleNextClick = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.next();
    }
  };

  // Render popover content
  const renderPopoverContent = () => {
    if (!popoverEvent) return null;

    const { extendedProps } = popoverEvent;
    const { activity, customer, duration } = extendedProps;

    return (
      <Box sx={{ p: 2, maxWidth: 300 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>{activity}</Typography>
        <Typography variant="body2" sx={{ mb: 0.5 }}>
          <strong>Time:</strong> {formatEventTime(popoverEvent.start, popoverEvent.end)}
        </Typography>
        <Typography variant="body2" sx={{ mb: 0.5 }}>
          <strong>Duration:</strong> {duration} minutes
        </Typography>
        <Typography variant="body2" sx={{ mb: 0.5 }}>
          <strong>Customer:</strong> {formatCustomerName(customer)}
        </Typography>
      </Box>
    );
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Training Calendar
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <ButtonGroup variant="outlined" size="small">
            <Button onClick={handleTodayClick}>Today</Button>
            <Button onClick={handlePrevClick}>Back</Button>
            <Button onClick={handleNextClick}>Next</Button>
          </ButtonGroup>

          <ButtonGroup variant="outlined" size="small">
            <Button
              onClick={() => handleViewChange('timeGridDay')}
              variant={view === 'timeGridDay' ? 'contained' : 'outlined'}
            >
              Day
            </Button>
            <Button
              onClick={() => handleViewChange('timeGridWeek')}
              variant={view === 'timeGridWeek' ? 'contained' : 'outlined'}
            >
              Week
            </Button>
            <Button
              onClick={() => handleViewChange('dayGridMonth')}
              variant={view === 'dayGridMonth' ? 'contained' : 'outlined'}
            >
              Month
            </Button>
            <Button
              onClick={() => handleViewChange('listWeek')}
              variant={view === 'listWeek' ? 'contained' : 'outlined'}
            >
              Agenda
            </Button>
          </ButtonGroup>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ height: 'calc(100vh - 200px)', minHeight: 600 }}>
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
              initialView={view}
              headerToolbar={false}
              events={events}
              eventClick={handleEventClick}
              eventTimeFormat={{
                hour: '2-digit',
                minute: '2-digit',
                meridiem: false
              }}
              allDaySlot={false}
              slotMinTime="06:00:00"
              slotMaxTime="22:00:00"
              height="100%"
              nowIndicator={true}
              weekNumbers={true}
              weekText="W"
              weekNumberFormat={{ week: 'numeric' }}
              navLinks={true}
              dayMaxEvents={true}
              fixedWeekCount={false}
              //contentHeight="auto"
              slotDuration="01:00:00"
              stickyHeaderDates={true}
            />
          </Box>
        )}
      </Box>

      <Popper
        open={openPopover}
        anchorEl={anchorEl}
        placement="bottom-start"
        modifiers={[
          {
            name: 'flip',
            options: {
              fallbackPlacements: ['top-start'],
            },
          },
        ]}
        sx={{ zIndex: 1300 }}
      >
        <ClickAwayListener onClickAway={handleClickAway}>
          <Paper elevation={3}>
            {renderPopoverContent()}
          </Paper>
        </ClickAwayListener>
      </Popper>
    </Container>
  );
}

export default TrainingCalendar; 