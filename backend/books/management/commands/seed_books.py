from django.core.management.base import BaseCommand

from books.models import Book

SAMPLE_BOOKS = [
    {
        "title": "The 7½ Deaths of Evelyn Hardcastle",
        "author": "Stuart Turton",
        "description": "A time-looping mystery set in a crumbling manor.",
        "category": "Mystery",
        "price": 14.99,
    },
    {
        "title": "Bad Blood",
        "author": "John Carreyrou",
        "description": "The rise and fall of Theranos and Elizabeth Holmes.",
        "category": "Non-fiction",
        "price": 12.99,
    },
    {
        "title": "Circe",
        "author": "Madeline Miller",
        "description": "Myth reimagined from the perspective of the witch Circe.",
        "category": "Fantasy",
        "price": 10.50,
    },
]


class Command(BaseCommand):
    help = "Seed the database with sample books"

    def handle(self, *args, **options):
        created = 0
        for payload in SAMPLE_BOOKS:
            _, was_created = Book.objects.get_or_create(title=payload["title"], defaults=payload)
            created += int(was_created)

        self.stdout.write(self.style.SUCCESS(f"Seeded sample books (created {created}, total {Book.objects.count()})."))
