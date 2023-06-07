from rest_framework.pagination import PageNumberPagination


class SearchResultsPaginator(PageNumberPagination):
    page_size = 8
    page_size_query_param = "page_size"
    max_page_size = 8


class CategoryPaginator(PageNumberPagination):
    page_size = 15
    page_size_query_param = "page_size"
    max_page_size = 18


class UserCommentsPaginator(PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 20
