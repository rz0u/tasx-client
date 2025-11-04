import {useState} from 'react';

// material-ui
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Box, Typography, TextField, Button, Stack, IconButton, Snackbar, Alert, CircularProgress } from "@mui/material";

// project imports
import { api, type Task } from "./api";
// import { api, type Task } from "./api.mock";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function App() {
  const qc = useQueryClient()
  const {data: tasks, isLoading, isError} = useQuery({ queryKey: ['tasks'], queryFn: api.list})

  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [toast, setToast] = useState<{open: boolean; msg: string; sev: 'success'|'error'|'info'}>({open: false, msg: '', sev: 'success'})

  const createTask = useMutation({
    mutationFn: () => api.create({title, description: desc || undefined}),
    onSuccess: () => {setTitle(''); setDesc(''); qc.invalidateQueries({queryKey: ['tasks']}); setToast({open: true, msg: 'Task created', sev: 'success'})},
    onError: () => setToast({open: true, msg: 'Failed to add task', sev: 'error'})
  });

  const updateTask = useMutation({
    mutationFn: ({ id, status }: { id:number; status: Task['status'] }) => api.updateStatus({id, status}),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['tasks'] }); setToast({open:true,msg:'Status updated',sev:'success'}); },
    onError: () => setToast({open:true,msg:'Update failed',sev:'error'})
  });

  const deleteTask = useMutation({
    mutationFn: (id: number) => api.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['tasks'] }); setToast({open:true,msg:'Task deleted',sev:'info'}); },
    onError: () => setToast({open:true,msg:'Delete failed',sev:'error'})
  });

  const isUpdating = (taskId: number) =>
  updateTask.isPending && updateTask.variables?.id === taskId;

const isDeleting = (taskId: number) =>
  deleteTask.isPending && deleteTask.variables === taskId;

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: '#f5f5f5',
      display: 'flex',
      justifyContent: 'center',
      py: 2
    }}>
      <Box sx={{
      width: '100%',
      maxWidth: '420px',
      bgcolor: 'white',
      fontFamily: '"Courier New", monospace',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      // filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.1))',
      // clipPath: 'polygon(0% 1.5%, 3% 0%, 6% 1.5%, 9% 0%, 12% 1.5%, 15% 0%, 18% 1.5%, 21% 0%, 24% 1.5%, 27% 0%, 30% 1.5%, 33% 0%, 36% 1.5%, 39% 0%, 42% 1.5%, 45% 0%, 48% 1.5%, 51% 0%, 54% 1.5%, 57% 0%, 60% 1.5%, 63% 0%, 66% 1.5%, 69% 0%, 72% 1.5%, 75% 0%, 78% 1.5%, 81% 0%, 84% 1.5%, 87% 0%, 90% 1.5%, 93% 0%, 96% 1.5%, 99% 0%, 100% 1.5%, 100% 98.5%, 99% 100%, 96% 98.5%, 93% 100%, 90% 98.5%, 87% 100%, 84% 98.5%, 81% 100%, 78% 98.5%, 75% 100%, 72% 98.5%, 69% 100%, 66% 98.5%, 63% 100%, 60% 98.5%, 57% 100%, 54% 98.5%, 51% 100%, 48% 98.5%, 45% 100%, 42% 98.5%, 39% 100%, 36% 98.5%, 33% 100%, 30% 98.5%, 27% 100%, 24% 98.5%, 21% 100%, 18% 98.5%, 15% 100%, 12% 98.5%, 9% 100%, 6% 98.5%, 3% 100%, 0% 98.5%)'
      }}>
        {/* Receipt Header */}
        <Box sx={{ 
          borderBottom: '2px dashed #333',
          p: 3,
          textAlign: 'center'
        }}>
          <Typography
            component="pre"
            sx={{
              fontFamily: '"Courier New", monospace',
              fontSize: '10px',
              fontWeight: 'bold',
              whiteSpace: 'pre',
              lineHeight: 1.1,
              mb: 0,
            }}
  >
{`░▒▓████████▓▒░▒▓██████▓▒░ ░▒▓███████▓▒░▒▓█▓▒░░▒▓█▓▒░ 
   ░▒▓█▓▒░  ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░ 
   ░▒▓█▓▒░  ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░ 
   ░▒▓█▓▒░  ░▒▓████████▓▒░░▒▓██████▓▒░ ░▒▓██████▓▒░  
   ░▒▓█▓▒░  ░▒▓█▓▒░░▒▓█▓▒░      ░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░ 
   ░▒▓█▓▒░  ░▒▓█▓▒░░▒▓█▓▒░      ░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░ 
   ░▒▓█▓▒░  ░▒▓█▓▒░░▒▓█▓▒░▒▓███████▓▒░░▒▓█▓▒░░▒▓█▓▒░ 
                                                     `}
  </Typography>
          <Typography sx={{ 
            fontFamily: '"Courier New", monospace',
            fontSize: '11px',
            mt: 0
          }}>
            {new Date().toLocaleString()}
          </Typography>
        </Box>

        <Snackbar
          open={toast.open}
          autoHideDuration={1500}
          onClose={() => setToast((t) => ({...t, open:false}))}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity={toast.sev} onClose={() => setToast((t) => ({...t, open:false}))}>
            {toast.msg}
          </Alert>
        </Snackbar>

        <Box sx={{ p: 3 }}>
          {/* Create form */}
          <Stack spacing={2} sx={{ mb: 3, pb: 3, borderBottom: '1px dashed #999' }}>
            <TextField
              label="Title*"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              size="small"
              slotProps={{
                input: {style: { fontFamily: '"Courier New", monospace' } },
                inputLabel: { style: { fontFamily: '"Courier New", monospace' } },
              }}
              sx={{
                '& .MuiInputLabel-root.Mui-focused': {
                    color: 'black',
                  },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'grey.500',
                  },
                  '&:hover fieldset': {
                    borderColor: 'black',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'black',
                  },
                },
              }}
            />
            <TextField
              label="Description"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              fullWidth
              size="small"
              slotProps={{
                input: {style: { fontFamily: '"Courier New", monospace' } },
                inputLabel: { style: { fontFamily: '"Courier New", monospace' } },
              }}
              sx={{
                '& .MuiInputLabel-root.Mui-focused': {
                    color: 'black',
                  },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'grey.500',
                  },
                  '&:hover fieldset': {
                    borderColor: 'black',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'black',
                  },
                },
              }}
            />
            <Button 
              variant="contained" 
              onClick={() => createTask.mutate()} 
              disabled={!title || createTask.isPending}
              sx={{ 
                bgcolor: '#333',
                fontFamily: '"Courier New", monospace',
                '&:hover': { bgcolor: '#555' }
              }}
            >
              + ADD ITEM
            </Button>
          </Stack>

          {/* List */}
          {isLoading && (
            <Typography
              sx={{
                fontFamily: '"Courier New", monospace',
                color: '#333',
                fontSize: '0.95rem',
                animation: 'blink 1s step-end infinite',
                '@keyframes blink': {
                  '50%': { opacity: 0 },
                },
              }}
            >
              Loading…
            </Typography>
          )}
          {isError && <Alert severity="error">Failed to load tasks</Alert>}
          <Stack spacing={0}>
            {tasks?.map((t, idx) =>
{              const updating = isUpdating(t.id);
              const deleting = isDeleting(t.id);

              const disableOthers =
                (updateTask.isPending && updateTask.variables?.id !== t.id) ||
                (deleteTask.isPending && deleteTask.variables !== t.id);
            return (
              <Box key={t.id} sx={{ 
                borderBottom: idx < tasks.length - 1 ? '1px dashed #ddd' : 'none',
                py: 2
              }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ 
                      fontFamily: '"Courier New", monospace',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      textTransform: 'uppercase'
                    }}>
                      {t.title}
                    </Typography>
                    {t.description && (
                      <Typography sx={{ 
                        fontFamily: '"Courier New", monospace',
                        fontSize: '12px',
                        color: '#666',
                        mt: 0.5
                      }}>
                        {t.description}
                      </Typography>
                    )}
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                      <Typography sx={{ 
                        fontFamily: '"Courier New", monospace',
                        fontSize: '11px',
                        bgcolor: t.status === 'done' ? '#4caf50' : t.status === 'in_progress' ? '#ff9800' : '#999',
                        color: 'white',
                        px: 1,
                        py: 0.25,
                        borderRadius: '2px'
                      }}>
                        {t.status.replace('_', ' ').toUpperCase()}
                      </Typography>
                      <Typography sx={{ 
                        fontFamily: '"Courier New", monospace',
                        fontSize: '10px',
                        color: '#999'
                      }}>
                        {new Date(t.created_at).toLocaleString()}
                      </Typography>
                    </Stack>
                  </Box>
                  <Stack direction="row" spacing={0.5}>
                    {t.status !== 'done' && (
                      <IconButton
                        size="small"
                        onClick={() => {
                          updateTask.mutate({ id: t.id, status: t.status });
                        }}
                        sx={{ 
                          color: t.status === 'pending' ? '#ff9800' : '#4caf50' // orange for start, green for complete
                        }}
                        disabled={disableOthers}
                      >
                        {updating ? (
                          <CircularProgress size={20} sx={{ color: t.status === 'pending' ? '#ff9800' : '#4caf50' }} />
                        ) : t.status === 'pending' ? (
                          <PlayArrowIcon fontSize="small" />
                        ) : (
                          <CheckIcon fontSize="small" />
                        )}
                      </IconButton>
                    )}
                    <IconButton 
                      size="small" 
                      onClick={() => deleteTask.mutate(t.id)}
                      sx={{ color: '#666' }}
                      disabled={disableOthers}
                    >
                      {deleting ? (
                        <CircularProgress size={20} sx={{ color: '#666' }} />
                      ) : (
                        <DeleteIcon fontSize="small" />
                      )}
                    </IconButton>
                  </Stack>
                </Stack>
              </Box>
            )}
            )}
          </Stack>

          {/* Receipt Footer */}
          <Box sx={{ 
            mt: 3,
            pt: 2,
            borderTop: '2px dashed #333',
            textAlign: 'center'
          }}>
            <Typography sx={{ 
              fontFamily: '"Courier New", monospace',
              fontSize: '11px',
              color: '#666'
            }}>
              TOTAL ITEMS: {tasks?.length || 0}
            </Typography>
            <Typography sx={{ 
              fontFamily: '"Courier New", monospace',
              fontSize: '10px',
              color: '#999',
              mt: 1
            }}>
              THANK YOU FOR USING TASX
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
