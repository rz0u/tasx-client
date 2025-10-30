import {useState} from 'react';

// material-ui
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import { AppBar, Toolbar, Typography, Container, TextField, Button, Card, CardContent, CardActions, Stack, IconButton, Chip, Snackbar, Alert } from "@mui/material";

// project imports
import { api, nextStatus, type Task } from "./api";
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

  return (
    <>
      <AppBar position='sticky' elevation={0}>
        <Toolbar sx={{display: 'flex', justifyContent:'center'}}>
          <Typography variant='h6'>
            Tasx
          </Typography>
        </Toolbar>
      </AppBar>

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

      <Container sx={{ py: 4, maxWidth: 'sm'}}>
        {/* Create form */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
          <TextField
            label="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            inputProps={{ maxLength: 200 }}
          />
          <TextField
            label="Description (optional)"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            fullWidth
          />
          <Button variant="contained" onClick={() => createTask.mutate()} disabled={!title || createTask.isPending}>
            Add
          </Button>
        </Stack>

        {/* List */}
        {isLoading && <Typography>Loading…</Typography>}
        {isError && <Alert severity="error">Failed to load tasks</Alert>}
        <Stack spacing={2}>
          {tasks?.map((t) => (
            <Card key={t.id} variant="outlined">
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <div>
                    <Typography variant="subtitle1" fontWeight={600}>{t.title}</Typography>
                    {t.description && <Typography color="text.secondary">{t.description}</Typography>}
                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                      <Chip
                        size="small"
                        label={t.status.replace('_', ' ')}
                        color={t.status === 'done' ? 'success' : t.status === 'in_progress' ? 'warning' : 'default'}
                        variant="outlined"
                      />
                      <Typography variant="caption" color="text.secondary">
                        {new Date(t.created_at).toLocaleString()}
                      </Typography>
                    </Stack>
                  </div>
                  <CardActions>
                    {t.status !== 'done' && (
                      <Button
                        size="small"
                        startIcon={<CheckIcon />}
                        onClick={() => updateTask.mutate({ id: t.id, status: t.status })}
                      >
                        Mark {nextStatus(t.status).replace('_', ' ')}
                      </Button>
                    )}
                    <IconButton aria-label="delete" onClick={() => deleteTask.mutate(t.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Container>
    </>
  )
}