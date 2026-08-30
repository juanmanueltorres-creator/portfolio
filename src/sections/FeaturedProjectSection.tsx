import { useTranslation } from 'react-i18next';
import {
  Container,
  Typography,
  Grid,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  useTheme,
} from '@mui/material';
import { geoplatformProject } from '../content/projects';
import type { SupportedLocale } from '../content/types';

export default function FeaturedProjectSection() {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const locale: SupportedLocale = i18n.language.toLowerCase().startsWith('es') ? 'es' : 'en';
  const project = geoplatformProject;
  const content = project.locale[locale];

  return (
    <Box
      id="featured"
      sx={{
        py: { xs: 6, md: 12 },
        position: 'relative',
        bgcolor: theme.palette.mode === 'dark' ? '#171c24' : '#f9f9f9',
        overflow: 'hidden',
        '::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          background:
            'radial-gradient(ellipse 70% 40% at 60% 0%, rgba(80,180,255,0.06) 0%, rgba(0,0,0,0.00) 80%), ' +
            'linear-gradient(120deg, rgba(80,0,255,0.035) 0%, rgba(0,255,255,0.02) 100%)',
          pointerEvents: 'none',
        },
        '::after': {
          content: '""',
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          backgroundImage: 'none',
          pointerEvents: 'none',
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ mb: { xs: 3, md: 4 }, textAlign: 'center' }}>
          <Typography variant="h2" sx={{ fontWeight: 700, mb: 0.5 }}>
            {content.title}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mb: 0.5 }}>
            <Chip label={content.statusLabel} color="success" />
            <Chip label={content.updatedLabel} />
          </Box>
          <Typography
            variant="h5"
            sx={{ color: 'text.secondary', maxWidth: 600, mx: 'auto', fontWeight: 400, lineHeight: 1.3, mb: 0 }}
          >
            {content.summary}
          </Typography>
        </Box>

        <Box sx={{ mb: { xs: 4, md: 7 } }}>
          <Grid container spacing={{ xs: 3, md: 4 }} justifyContent="center">
            {content.features.map((feature) => (
              <Grid item xs={12} sm={6} md={3} key={feature}>
                <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', height: '100%' }}>
                  <CardContent
                    sx={{
                      p: { xs: 3, md: 4 },
                      minHeight: 90,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography sx={{ fontWeight: 500, textAlign: 'center', fontSize: { xs: '1rem', md: '1.08rem' } }}>
                      {feature}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box
          sx={{
            maxWidth: 460,
            mx: 'auto',
            mb: { xs: 4, md: 6 },
            mt: { xs: 4, md: 7 },
          }}
        >
          <Box
            sx={{
              position: 'relative',
              minHeight: { xs: 200, sm: 250, md: 310 },
              borderRadius: 4,
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.08)',
              background:
                theme.palette.mode === 'dark'
                  ? 'linear-gradient(180deg, rgba(20, 27, 40, 0.96), rgba(11, 16, 26, 0.98))'
                  : 'linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(244, 247, 251, 0.98))',
              boxShadow:
                theme.palette.mode === 'dark'
                  ? '0 24px 60px rgba(0, 0, 0, 0.3)'
                  : '0 20px 45px rgba(15, 23, 42, 0.12)',
              '&:hover img': {
                transform: 'scale(1.02)',
              },
            }}
          >
            <Box
              component="img"
              src={`${(import.meta as any).env.BASE_URL}${project.image.src}`}
              alt={content.imageAlt}
              sx={{
                width: '100%',
                height: '100%',
                display: 'block',
                objectFit: 'cover',
                objectPosition: 'center 35%',
                transition: 'transform 0.35s ease',
              }}
            />
          </Box>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic', textAlign: 'center', mt: 2 }}>
            {content.imageCaption}
          </Typography>
        </Box>

        <Box sx={{ mb: { xs: 2, md: 3 } }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, textAlign: 'center' }}>
            {content.architectureTitle}
          </Typography>
          <Grid container spacing={{ xs: 3, md: 4 }} justifyContent="center">
            {project.architecture.map((group) => (
              <Grid item xs={12} sm={6} md={3} key={group.key}>
                <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', height: '100%' }}>
                  <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      {group.title[locale]}
                    </Typography>
                    <List dense>
                      {group.items[locale].map((item) => (
                        <ListItem disableGutters key={item}>
                          <ListItemText primary={item} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: { xs: 2, md: 4 } }}>
          {project.links.live && (
            <Button
              variant="contained"
              href={project.links.live}
              target="_blank"
              size="large"
              sx={{ fontWeight: 600 }}
            >
              {t('featured.btnLiveDemo')}
            </Button>
          )}
          {project.links.api && (
            <Button variant="outlined" href={project.links.api} target="_blank" size="large">
              {t('featured.btnAPI')}
            </Button>
          )}
          {project.links.source && (
            <Button variant="outlined" href={project.links.source} target="_blank" size="large">
              {t('featured.btnCode')}
            </Button>
          )}
        </Box>
      </Container>
    </Box>
  );
}
