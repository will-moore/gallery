from django.conf.urls import url
from .gallery_settings import SUPER_CATEGORIES

from . import views

urlpatterns = [

    # index 'home page' of the webgallery app
    url(r'^$', views.index, name='webgallery_index'),

    url(r'^gallery_settings/$', views.gallery_settings),

    # group view
    url(r'show_group/(?P<group_id>[0-9]+)/$',
        views.show_group,
        name='webgallery_show_group'),

    # project view
    url(r'show_project/(?P<project_id>[0-9]+)/$',
        views.show_project,
        name='webgallery_show_project'),

    # dataset view
    url(r'show_dataset/(?P<dataset_id>[0-9]+)/$',
        views.show_dataset,
        name='webgallery_show_dataset'),
    # use the same dataset view, with a different
    # template that only shows thumbnails
    url(r'dataset_thumbs/(?P<dataset_id>[0-9]+)/$',
        views.show_dataset,
        {'template': 'webgallery/dataset_thumbs.html'},
        name='webgallery_dataset_thumbs'),

    # image view
    url(r'show_image/(?P<image_id>[0-9]+)/$',
        views.show_image, name='webgallery_show_image'),

    # list images within container. NB: not used but potentially useful
    url(r'^gallery-api/(?P<obj_type>[screen|project]+)s/'
        r'(?P<obj_id>[0-9]+)/images/$',
        views.study_images, name='webgallery_study_image'),

    # Supports e.g. ?project=1&project=2&screen=3
    url(r'^gallery-api/thumbnails/$', views.api_thumbnails,
        name='webgallery_api_thumbnails'),

    # catch-all - render React app
    url(r'^', views.index),
]
